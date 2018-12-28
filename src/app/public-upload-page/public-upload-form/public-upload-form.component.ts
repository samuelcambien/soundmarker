import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestCall} from "../../rest/rest-call";
import * as wave from "../../player/dist/player.js"
import {Version} from "../../model/version";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent implements OnInit {

  notes: string;
  email_from: string;
  email_to: string;

  sharemode: "email" | "link" = "link";
  expiration: "week" | "month" = "week";
  downloadable: boolean = false;

  player;

  @Input() uploader: FileUploader;
  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();
  @Output() link = new EventEmitter<string>();

  @ViewChild('notes_element') notes_element: ElementRef;

  protected convert(item: FileItem): Promise<File> {

    let converter: Function;

    switch (Mp3Encoder.getExtension(item._file.name)) {
      case "wav-16bit":
        converter = Mp3Encoder.convertWav16bit;
        break;
      case "m4a":
      case "wav-other":
        converter = Mp3Encoder.convertWavOther;
        break;
      case "alac":
        converter = Mp3Encoder.convertAlac;
        break;
      case "aiff":
        converter = Mp3Encoder.convertAiff;
        break;
      case "flac":
        converter = Mp3Encoder.convertFlac;
        break;
      case "mp3":
      default:
        converter = Mp3Encoder.convertMp3;
        break;
    }

    return converter(item._file, item._file.name);
  }

  onSubmit() {

    this.uploading.emit();

    RestCall.createNewProject()
      .then(response => {

        let project_id = response["project_id"];
        Promise.all(this.uploader.queue.map(track => this.processTrack(project_id, track)))
          .then(() => RestCall.shareProject(project_id, this.email_from, this.email_to ? this.email_to.split(",") : []))
          .then(response => {
            this.finished.emit();
            this.link.emit(response["project_hash"]);
          });
      });
  }

  private processTrack(projectId, track: FileItem): Promise<any> {

    let length = 0;
    let uploads = [];
    return this.processTrackMetadata(projectId, track)
      .then(version => {
        let versionId = version["version_id"];
        let file_name = Mp3Encoder.getName(track._file.name);
        let extension = Mp3Encoder.getExtension(track._file.name);

        if (this.downloadable) {
          uploads.push(
            this.uploadDownloadFile(track._file, file_name, extension, track._file.size, versionId, length)
          );
          this.uploader.files++;
        }

        uploads.push(
          this.convert(track)
            .then(converted =>
              this.uploadStreamFile(converted, file_name, "mp3", track._file.size, versionId, length)
            )
        );
        this.uploader.files++;

        return Promise.all(uploads);
      });
  }

  processTrackMetadata(projectId: string, track: FileItem): Promise<Version> {
    return Promise.all([
      RestCall.createNewTrack(projectId, track),
      this.getAudioBuffer(track)
    ]).then(result => {
      return {trackId: result[0]["track_id"], buffer: result[1]}
    }).then(({trackId, buffer}) =>
      RestCall.createNewVersion(
        trackId, this.notes_element.nativeElement.value, buffer.duration, this.getWaveform(buffer), this.downloadable ? "1" : "0"
      )
    );
  }

  private getWaveform(buffer: AudioBuffer): string {

    let wavediv: HTMLDivElement = document.createElement('div');
    wavediv.classList.add("waveform");
    window.document.body.appendChild(wavediv);

    const waveform = wave.create({
      container: wavediv
    });
    waveform.loadDecodedBuffer(buffer);

    return waveform.backend.getPeaks(743, 0, 743);
  }

  private getAudioBuffer(track): Promise<AudioBuffer> {
    return Mp3Encoder.read(track._file).then((buffer: ArrayBuffer) => Mp3Encoder.decode(buffer));
  }

  private uploadDownloadFile(file: File, file_name: string, extension: string, size: number, versionId: string, length: number): Promise<any> {

    return RestCall.createNewFile(file, file_name, extension, size, versionId, 0, length)
      .then(({fileId, buffer}) => {
        return RestCall.uploadChunk(buffer, fileId, 0, extension)
          .then(() => this.uploader.uploaded++);
      });
  }

  private uploadStreamFile(file: File, file_name: string, extension: string, size: number, versionId: string, length: number): Promise<any> {

    return RestCall.createNewFile(file, file_name, extension, size, versionId, 1, length)
      .then(({fileId, buffer}) =>
        RestCall.uploadChunk(buffer, fileId, 0, extension)
          .then(() => this.uploader.uploaded++)
      );
  }

  private searchSyncWord(uint8Array: Uint8Array, startIndex: number) {

    for (let i = startIndex; i < uint8Array.length; i++) {
      if (uint8Array[i] == 255 && uint8Array[i + 1] == 251) {
        return i;
      }
    }
  }

  constructor(private _host: ElementRef) {

  }

  ngOnInit(): void {
    console.log("");
    // wave.init({
    //   container: canvas
    // });
    // wave.loadDecodedBuffer(buffer);
  }
}
