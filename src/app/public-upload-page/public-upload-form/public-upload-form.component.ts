import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Directive, HostListener} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Observable} from 'rxjs';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestCall} from "../../rest/rest-call";
import * as wave from "../../player/dist/player.js"
import {Version} from "../../model/version";
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgModel, FormControl, FormGroup, FormBuilder, Validators, EmailValidator} from '@angular/forms';

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

  public validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];

  player;

  @Input() uploader: FileUploader;
  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();
  @Output() link = new EventEmitter<string>();

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
    let title = Mp3Encoder.getName(track._file.name);
    let extension = Mp3Encoder.getExtension(track._file.name);

    return Promise.all([
      RestCall.createNewTrack(projectId, title),
      this.getAudioBuffer(track)
    ]).then(result => {
      return {trackId: result[0]["track_id"], buffer: result[1]}
    }).then(({trackId, buffer}) =>
      RestCall.createNewVersion(
          trackId, this.notes_element.nativeElement.value, buffer.duration, this.getWaveform(buffer), this.downloadable ? "1" : "0"
        )
    ).then(version => {
      let versionId = version["version_id"];

      if (this.downloadable) {
        uploads.push(
          this.uploadDownloadFile(track._file, title, extension, track._file.size, versionId, length)
        );
        this.uploader.files++;
      }

      uploads.push(
        this.convert(track, title, extension)
          .then(converted =>
            this.uploadStreamFile(converted, title, "mp3", track._file.size, versionId, length)
          )
      );
      this.uploader.files++;

      return Promise.all(uploads);
    });
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

  private context: AudioContext;

  private getAudioBuffer(track): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>(resolve => {
      Mp3Encoder.read(track._file).then(
        (buffer: ArrayBuffer) => this.context.decodeAudioData(buffer, (result) => resolve(result))
      );
    })
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

  constructor() {
    try{
      this.context = new AudioContext();
    } catch (e) {
      this.context = new webkitAudioContext();
    }
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
