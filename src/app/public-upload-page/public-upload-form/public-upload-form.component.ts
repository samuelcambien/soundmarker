import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {RestCall} from "../../rest/rest-call";
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, NgControl, Validators} from '@angular/forms';
import {Utils} from "../../app.component";
import {LocalStorageService} from "../../services/local-storage.service";
import {PublicUploadPageComponent} from "../public-upload-page.component";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})

export class PublicUploadFormComponent implements OnInit {

  notes: string;
  email_from: string = this.localStorageService.getEmailFrom();
  email_to: string[];

  validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];
  player;

  @Input() uploader: FileUploader;
  @Input() queueSizeMargin;
  @Input() tryAgain: EventEmitter<any>;

  @Output() uploading = new EventEmitter();
  @Output() finished = new EventEmitter();
  @Output() link = new EventEmitter<string>();
  @Output() period = new EventEmitter<string>();
  @Output() removedFileSize = new EventEmitter<number>();
  @Output() error = new EventEmitter();
  @Output() form = new EventEmitter();

  @ViewChild('notes_element') notes_element: ElementRef;
  @ViewChild('ft') files_tooltip: NgbTooltip;


  onSubmit() {
    this.uploading.emit();
    this.storePreferences();
    RestCall.createNewProject()
      .then(response => {
        let project_id = response["project_id"];
        return Utils.promiseSequential(
          this.uploader.queue.map(track => () =>
            this.processTrack(project_id, track)
          )
        ).then(() => {
                if(this.notifyID != "0")  RestCall.subscribe(project_id, this.email_from, this.notifyID);
                return RestCall.shareProject(project_id, this.expiration, this.notes, this.email_from, this.email_to)
            }
        ).
        then(response => {
          this.finished.emit();
          this.clearForm(true);
          this.link.emit(response["project_hash"]);
          this.period.emit(this.expiration.substr(1,this.expiration.length));
        })
      })
      .catch((e) => {
        this.clearForm(false);
        this.error.emit(e)
      });
  }

  private processTrack(projectId, track: FileItem): Promise<any> {

    let length = 0;
    let title = Utils.getName(track._file.name);
    let extension = Utils.getExtension(track._file.name);

    return RestCall.createNewTrack(projectId, title)
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
                RestCall.uploadChunk(buffer, streamFileId, downloadFileId, 0, extension, progress => this.setChunkProgress(progress))
              ).then(() => this.setChunkCompleted())
          );
      })
  }

  private setChunkProgress(progress: number) {
    this.setProgress(((100 * this.uploader.uploaded + progress) / this.uploader.queue.length));
  }

  private setChunkCompleted() {
    this.uploader.uploaded++;
    this.setProgress(100 * this.uploader.uploaded / this.uploader.queue.length);
  }

  private setProgress(progress: number) {
    this.uploader.progress = progress;
  }

  private getStreamFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<{ fileId: string, buffer: ArrayBuffer }> {
    return RestCall.createNewFile(file, title, this.getStreamFileExtension(extension), track._file.size, versionId, 0, length);
  }

  private getStreamFileExtension(extension: string) {
    switch (extension) {
      case "aac":
        return "aac";
      default:
        return "mp3"
    }
  }

  private getDownloadFileId(file, title, extension, track: FileItem, versionId, length: number): Promise<string> {
    if (this.downloadable) {
      return RestCall.createNewFile(file, title, extension, track._file.size, versionId, 1, length)
        .then(({fileId: fileId}) => fileId);
    } else {
      return new Promise(resolve => resolve("null"));
    }
  }

  expirations= [{id: '1week', label: 'Week', heading: 'Expire*'}, {id: '1month', label: 'Month', heading: 'Expire*'}];
  expiration;

  availability= [{id: false, label: 'No', heading: 'Download*'}, {id: true, label: 'Yes', heading: 'Download*'}];
  downloadable;

  notifications= [{id: '1', label: 'Daily', heading: 'Notify*'}, {id: '2', label: 'Instantly', heading: 'Notify*'},{id: '0', label: 'Never', heading: 'Notify*'}];
  notifyID;

  ngOnInit(): void {
    // wave.init({
    //   container: canvas
    // });
    // wave.loadDecodedBuffer(buffer);
    // this.notifyID =  this.localStorageService.getNotificationID();
    // this.expiration =  this.localStorageService.getExpirationType();
    // this.downloadable =  this.localStorageService.getAllowDownloads();
    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          message = "You exceeded the limit of 2 GB."
          break;
        case 'onlyAudio':
          message = "One or more files are not supported and were not added.";
          break;
        case 'checkSizeLimit':
          message = "You exceeded the limit of 2 GB.";
          break;
        default:
          message = "Something went wrong, please try again.";
          break;
      }
      this.files_tooltip.open(this.files_tooltip.ngbTooltip = message);
    };
  }

  constructor(private localStorageService: LocalStorageService) {
  }

  private clearForm(clearData): void {
    if (clearData) {
      this.notes = '';
      this.email_to = [];
    }
    this.uploader.clearQueue();
  }

  private storePreferences() {
    this.localStorageService.storeEmailFrom(this.email_from);
    this.localStorageService.storeAllowDownloads(this.downloadable);
    this.localStorageService.storeNotifyID(this.notifyID);
    this.localStorageService.storeExpirationType(this.expiration);
  }

  getAcceptedFileTypes() {
    return PublicUploadPageComponent.ACCEPTED_FILE_TYPES;
  }

  removeFromQueue(item){
    this.uploader.removeFromQueue(item);
    this.removedFileSize.emit(item.file.size);
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

  @HostListener('focusout') onFocusOutMethod() {
    if (this.control.dirty && this.control.invalid && this.control.value) {
      this.tooltip.open();
    } else {
      this.tooltip.close();
    }
  }
}
