import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostListener, Directive} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestCall} from "../../rest/rest-call";
import * as wave from "../../player/dist/player.js"
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {Validators, NgControl} from '@angular/forms';
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
  email_to: string[];

  sharemode: "email" | "link" = "link";
  expiration: "week" | "month" = "week";
  downloadable: boolean = false;

  validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];
  player;

  @Input() uploader: FileUploader;
  @Input() tryAgain: EventEmitter<any>;

  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();
  @Output() link = new EventEmitter<string>();
  @Output() error = new EventEmitter();
  @Output() form = new EventEmitter();

  @ViewChild('notes_element') notes_element: ElementRef;
  @ViewChild('ft') files_tooltip: NgbTooltip;

  tracks_left = () => {return this.uploader.options.queueLimit - this.uploader.queue.length};

  onSubmit() {
    this.uploading.emit();
    RestCall.createNewProject()
      .then(response => {
        let project_id = response["project_id"];
        return Promise.all(this.uploader.queue.map(track => this.processTrack(project_id, track)))
          .then(() => {
            if (this.sharemode === 'email') {
              return RestCall.shareProject(project_id, this.email_from, this.email_to)
            } else {
              return RestCall.shareProject(project_id)
            }
          })
          .then(response => {
            this.finished.emit();
            this.clearForm(true);
            this.link.emit(response["project_hash"]);
          })
      })
      .catch((e) => {
        this.clearForm(false);
        this.error.emit(e)});
  }

  private processTrack(projectId, track: FileItem): Promise<any> {

    let length = 0;
    let title = Mp3Encoder.getName(track._file.name);
    let extension = Mp3Encoder.getExtension(track._file.name);

    return RestCall.createNewTrack(projectId, track._file.name)
      .then(response =>
        RestCall.createNewVersion(
          response["track_id"], this.notes_element.nativeElement.value, this.downloadable ? "1" : "0"
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
      })
  }

  private getStreamFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<{ fileId: string, buffer: ArrayBuffer }> {
    return RestCall.createNewFile(file, title, extension, track._file.size, versionId, 1, length);
  }

  private getDownloadFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<string> {
    if (this.downloadable) {
      return RestCall.createNewFile(file, title, "mp3", track._file.size, versionId, 0, length)
        .then(({fileId: fileId}) => fileId);
    } else {
      return new Promise(resolve => resolve("null"));
    }
  }

  ngOnInit(): void {
    // wave.init({
    //   container: canvas
    // });
    // wave.loadDecodedBuffer(buffer);
    this.uploader.onWhenAddingFileFailed = (item, filter) =>  {
      let message= '';
      switch (filter.name) {
        case 'queueLimit':
          message = 'Max of ' + this.uploader.options.queueLimit + ' tracks exceeded. Not all tracks were added.';
          break;
        case 'fileSize':
          message = "One or more tracks exceeded the limit of 500MB per track."
          break;
        case 'onlyAudio':
          message = "One or more files are not supported and were not added."
          break;
        default:
          message = "Something went wrong, please try again.";
          break;
      }
      this.files_tooltip.open(this.files_tooltip.ngbTooltip= message);
    };
  }

  constructor(){  }

  private clearForm(clearData): void{
    if (clearData) {
      this.notes = '';
      this.email_to = [];
    }
    this.uploader.clearQueue();
  }
}

@Directive({
  selector: '[emailValidationTooltip]'
})

export class EmailValidationToolTip {
  control: any;
  tooltip: NgbTooltip;

  constructor(control: NgControl, tooltip: NgbTooltip) {
    this.tooltip = tooltip;
    this.control = control;
    this.control.statusChanges.subscribe((status) => {
      if (control.dirty && control.invalid) {
      } else {
        tooltip.close();
      }
    });
  }

  @HostListener('focusout') onFocusOutMethod(){
    if (this.control.dirty && this.control.invalid && this.control.value) {
      this.tooltip.open();
    } else {
      this.tooltip.close();}
  }
}
