import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestCall} from "../../rest/rest-call";
import * as wave from "../../player/dist/player.js"
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {Validators} from '@angular/forms';
import {File} from "../../model/file";

declare var AudioContext: any, webkitAudioContext: any;

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})

export class PublicUploadFormComponent implements OnInit {

  notes: string;
  email_from: string;
  email_to: string;

  sharemode: "email" | "link" = "email";
  expiration: "week" | "month" = "week";
  downloadable: boolean = false;
  max_tracks: number = 30;
  tracks_left = () => { return this.max_tracks - this.uploader.queue.length };

  validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];

  player;

  @Input() uploader: FileUploader;

  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();
  @Output() link = new EventEmitter<string>();
  @Output() error = new EventEmitter();



  @ViewChild('notes_element') notes_element: ElementRef;

  protected convert(file: FileItem, name: string, extension: string): Promise<File> {

    let converter: Function;

    switch (extension) {
      case "wav-16bit":
        converter = Mp3Encoder.convertWav16bit;
        break;
      case "m4a":
      case "wav":
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

    return converter(file._file, name);
  }

  onSubmit() {

    this.uploading.emit();
    RestCall.createNewProject()
      .then(response => {

        let project_id = response["project_id"];
        return Promise.all(this.uploader.queue.map(track => this.processTrack(project_id, track)))
          .then(() => {
            if (this.sharemode === 'email') {
              return RestCall.shareProject(project_id, this.email_from, this.email_to.split(","))
            } else {
              return RestCall.shareProject(project_id)
            }
          })
          .then(response => {
            this.finished.emit();
            this.link.emit(response["project_hash"]);
          })
      })
      .catch((e) => this.error.emit(e));
  }

  private processTrack(projectId, track: FileItem): Promise<any> {

    let length = 0;
    let uploads = [];
    let title = Mp3Encoder.getName(track._file.name);
    let extension = Mp3Encoder.getExtension(track._file.name);

    return Promise.all([
      RestCall.createNewTrack(projectId, track._file.name),
      Mp3Encoder.decode(track._file)
    ]).then(result => {
      return {trackId: result[0]["track_id"], buffer: result[1]}
    }).then(({trackId, buffer}) =>
      RestCall.createNewVersion(
        trackId, this.notes_element.nativeElement.value, buffer.duration, this.getWaveform(buffer), this.downloadable ? "1" : "0"
      )
    ).then(version => {
      let versionId = version["version_id"];
      return this.getStreamFileId(track._file, title, extension, track, versionId, length)
        .then(({fileId: streamFileId, buffer: buffer}) =>
          this.getDownloadFileId(track._file, title, extension, track, versionId, length)
            .then(downloadFileId =>
              RestCall.uploadChunk(buffer, streamFileId, downloadFileId, 0, extension)
            )
        );
    });
  }

  private getStreamFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<{ fileId: string, buffer: ArrayBuffer }> {
    return RestCall.createNewFile(file, title, extension, track._file.size, versionId, 0, length);
  }

  private getDownloadFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<string> {
    if (this.downloadable) {
      return RestCall.createNewFile(file, title, "mp3", track._file.size, versionId, 1, length)
        .then(({fileId: fileId}) => fileId);
    } else {
      return new Promise(resolve => resolve("null"));
    }
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

  ngOnInit(): void {
    console.log("");
    // wave.init({
    //   container: canvas
    // });
    // wave.loadDecodedBuffer(buffer);
  }

  public onValidationError(tooltip: NgbTooltip, control) {
    console.log("Validation error"+this.email_to);
  }
}
