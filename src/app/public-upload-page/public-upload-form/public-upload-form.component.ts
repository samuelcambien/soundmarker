import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import * as Player from "../../player/dist/player.js";
import {RestCall} from "../../rest/rest-call";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent {

  notes: string;
  email_from: string;
  email_to: [string];

  sharemode: "email" | "link" = "email";
  expiration: "week" | "month" = "week";
  downloadable: boolean = false;

  project_url: string;

  player;

  @Input() uploader: FileUploader;
  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();

  @ViewChild('waveform') waveform: ElementRef;

  protected convert(item: FileItem): Promise<File> {

    // let type = "aiff", converter: Function;
    let type = "flac", converter: Function;

    switch (type) {
      case "wav-16bit":
        converter = Mp3Encoder.convertWav16bit;
        break;
      case "wav-other":
        converter = Mp3Encoder.convertWavOther;
        break;
      case "flac":
        converter = Mp3Encoder.convertFlac;
        break;
      case "alac":
        converter = Mp3Encoder.convertAlac;
        break;
      case "aiff":
        converter = Mp3Encoder.convertAiff;
    }

    return converter(item._file, item._file.name);
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onSubmit() {

    this.uploading.emit();

    RestCall.createNewProject()
      .then(response => {

        let project_id = response["project_id"];
        Promise.all(this.uploader.queue.map(track => this.processTrack(project_id, track)))
          .then(() => RestCall.shareProject(project_id, this.email_from, this.email_to))
          .then(response => this.project_url = response["project_url"])
          .then(() => this.finished.emit());
      });
  }

  private processTrack(projectId, track: FileItem): Promise<any> {

    let length = 0;

    return Promise.all([
      RestCall.createNewTrack(projectId, track),
      this.getAudioBuffer(track)
    ]).then(result => {
      return {trackId: result[0]["track_id"], buffer: result[1]}
    }).then(({trackId, buffer}) =>
      RestCall.createNewVersion(trackId, this.notes, buffer.duration, this.getWaveform(buffer))
    ).then(response => {
        let versionId = response["version_id"];
        let file_name = Mp3Encoder.getName(track._file.name);
        let extension = Mp3Encoder.getExtension(track._file.name);

        let uploads = [];

        if (this.downloadable)
          uploads.push(
            this.uploadDownloadFile(track._file, file_name, extension, track._file.size, versionId, length)
          );
        uploads.push(
          this.convert(track)
            .then(file =>
              this.uploadStreamFile(file, file_name, "mp3", file.size, versionId, length)
            )
        );

        return Promise.all(uploads);
      });
  }

  private getWaveform(buffer: AudioBuffer): string {

    Player.init({
      container: "#waveform"
    });
    Player.loadDecodedBuffer(buffer);

    return this.waveform.nativeElement.querySelector("canvas").toDataURL("image/png");
  }

  private getAudioBuffer(track): Promise<AudioBuffer> {
    return Mp3Encoder.read(track._file).then((buffer: ArrayBuffer) => Mp3Encoder.decode(buffer));
  }

  private uploadDownloadFile(file: File, file_name: string, extension: string, size: number, versionId: string, length: number): Promise<any> {

    return RestCall.createNewFile(file, file_name, extension, size, versionId, length)
      .then(({fileId, buffer}) => {
        let chunk_byte_length = 44100;
        // for (let i = 0; i * chunk_byte_length < buffer.byteLength; i++) {
        RestCall.uploadChunk(buffer, fileId, 0, extension)
        // }
      });
  }

  private uploadStreamFile(file: File, file_name: string, extension: string, size: number, versionId: string, length: number): Promise<any> {

    return RestCall.createNewFile(file, file_name, extension, size, versionId, length)
      .then(({fileId, buffer}) => {
        let chunk_byte_length = 192 / 8 * 1000 * 10;
        for (let i = 0; i * chunk_byte_length < buffer.byteLength; i++) {
          RestCall.uploadChunk(buffer.slice(i * chunk_byte_length, (i + 1) * chunk_byte_length), fileId, i, extension);
        }
      });
  }
}
