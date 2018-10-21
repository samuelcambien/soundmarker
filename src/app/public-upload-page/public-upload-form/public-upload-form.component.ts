import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestUrl, Utils} from "../../app.component";
import * as Player from "../../player/dist/player.js";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent implements OnInit {

  notes: string;
  email_from: string;
  email_to: [string];

  sharemode: "email" | "Link";

  project_url: string;

  player;

  @Input() uploader: FileUploader;

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

    console.log(this.sharemode);

    Utils.sendPostRequest(RestUrl.PROJECT_NEW, {})
      .then(response => {

        let project_id = response["project_id"];
        this.uploader.queue.forEach(track => this.processTrack(project_id, track));

        Utils.sendPostRequest(RestUrl.PROJECT_SHARE, {
          project_id: project_id,
          sender: this.email_from,
          receiver: this.email_to
        }).then(response =>
          this.project_url = response["project_url"]
        );
      });
  }

  private processTrack(project_id, track) {

    let my = this;

    Promise.all([
      this.createNewVersion(project_id, track),
      this.getAudioBuffer(track)
    ]).then(result => {

      let versionId = result[0]["version_id"];
      let audioBuffer: AudioBuffer = result[1];
      let length = audioBuffer.duration;
      Player.init({
        container: "#waveform"
      });
      Player.loadDecodedBuffer(audioBuffer);

      let waveform = my.waveform.nativeElement.querySelector("canvas").toDataURL("image/png");

      this.uploadDownloadFile(track._file, versionId, length);
      this.convert(track)
        .then(file =>
          this.uploadStreamFile(file, versionId, length)
        );
    });
  }

  private createNewVersion(project_id, track): Promise<any> {
    return Utils.sendPostRequest(RestUrl.TRACK_NEW, {
      project_id: project_id,
      title: track._file.name
    }).then(response =>
      Utils.sendPostRequest(RestUrl.VERSION_NEW, {
        track_id: response["track_id"]
      })
    );
  }

  private getAudioBuffer(track) {
    return Mp3Encoder.read(track._file).then((buffer: ArrayBuffer) => Mp3Encoder.decode(buffer));
  }

  private uploadDownloadFile(file: File, versionId: string, length: number): Promise<any> {
    return this.uploadFile(file, versionId, length)
      .then(({fileId, buffer}) =>
        this.uploadChunk(buffer, fileId, 0, "wav")
      );
  }

  private uploadStreamFile(file: File, versionId: string, length: number): Promise<any> {

    return this.uploadFile(file, versionId, length)
      .then(({fileId, buffer}) => {
        let chunk_byte_length = 192 / 8 * 1000 * 10;
        console.log(chunk_byte_length);
        for (let i = 0; i * chunk_byte_length < buffer.byteLength; i++) {
          this.uploadChunk(buffer.slice(i * chunk_byte_length, (i + 1) * chunk_byte_length), fileId, i, "mp3");
        }
      });
  }

  private uploadFile(file: File, versionId: string, length: number): Promise<{ fileId: string, buffer: ArrayBuffer }> {
    return Promise.all([
      Utils.sendPostRequest(RestUrl.UPLOAD, {
        version_id: versionId,
        identifier: 0,
        track_length: length,
        chunk_length: 10,
        file_name: file.name,
        file_size: file.size
      }),
      Mp3Encoder.read(file)
    ]).then(result => {
      return {fileId: result[0]["file_id"], buffer: result[1]};
    });
  }

  private uploadChunk(buffer: ArrayBuffer, fileId: string, index: number, ext: string): Promise<any> {
    return Utils.sendPostDataRequest(RestUrl.UPLOAD_CHUNK, buffer, [fileId, index, ext]);
  }

  ngOnInit(): void {
    // console.log("Player: " + Player);
    // this.player = new Player.Player();
    // this.player.init();
    // console.log("player: " + this.player);
  }
}
