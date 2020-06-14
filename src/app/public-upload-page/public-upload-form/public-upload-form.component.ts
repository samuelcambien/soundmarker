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
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgControl, NgForm, Validators} from '@angular/forms';
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

  totalQueueSize: number = 0;
  uploadedFilesSize: number= 0;

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
  @ViewChild('ngbPopover') ngbPopover: NgbPopover;
  @ViewChild('dropZone') dropZone;

  async onSubmit() {
    this.uploading.emit();
    this.storePreferences();
    this.totalQueueSize = this.calculateTotalQueueSize();

    try {
      const projectResponse = await RestCall.createNewProject();
      let project_id = projectResponse["project_id"];

      await Utils.promiseSequential(
        this.uploader.queue.map(track => () => this.processTrack(project_id, track))
      );

      if (this.notifications)
        RestCall.subscribe(project_id, this.email_from, 2);

      const shareResponse = await RestCall.shareProject(project_id, "1month", this.notes, this.email_from, this.email_to);

      this.link.emit(shareResponse["project_hash"]);
      this.finished.emit();

      this.clearForm(true);

    } catch (e) {
      this.clearForm(false);
      this.error.emit(e);
    }
  }

  private async processTrack(projectId, track: FileItem): Promise<void> {

    const length = 0;
    const title = Utils.getName(track._file.name);
    const extension = Utils.getExtension(track._file.name);

    const trackResponse = await RestCall.createNewTrack(projectId, title);
    const trackId = trackResponse["track_id"];

    const versionResponse = await RestCall.createNewVersion(
      trackId, this.notes_element.nativeElement.value, this.availability ? "1" : "0"
    );
    const versionId = versionResponse["version_id"];

    const streamFileResponse = await RestCall.createNewFile(track._file, title, this.getStreamFileExtension(extension), track._file.size, versionId, 0, length);
    const streamFileId = streamFileResponse["file_id"];

    let downloadFileId: string;
    if (this.availability) {
      const downloadFileResponse = await RestCall.createNewFile(track._file, title, extension, track._file.size, versionId, 1, length);
      downloadFileId = downloadFileResponse["file_id"];
    } else {
      downloadFileId = "0";
    }

    const buffer: ArrayBuffer = await Utils.read(track._file);
    console.log(streamFileId);
    await RestCall.uploadChunk(new Blob([buffer]), streamFileId, downloadFileId, 0, extension, progress => this.setChunkProgress(progress, track._file.size));
    this.setChunkCompleted(track._file.size);
  }

  private setChunkProgress(progress: number, fileSize: number) {
    let totalDone = 100*(this.uploadedFilesSize+progress*fileSize)/this.totalQueueSize;
    this.setProgress(totalDone);
    // this.setProgress(((100 * this.uploader.uploaded + progress) / this.uploader.queue.length));
  }

  private setChunkCompleted(fileSize) {
    this.uploader.uploaded++;
    this.uploadedFilesSize += fileSize;
    this.setProgress(100*this.uploadedFilesSize/this.totalQueueSize);
    console.log(this.uploader.progress);
  }

  private setProgress(progress: number) {
      this.uploader.progress = progress;
      // this.uploader.progress = 100;
  }

  private getStreamFileExtension(extension: string) {
    switch (extension) {
      case "aac":
        return "aac";
      default:
        return "mp3"
    }
  }

  ngbPopOverMessage;

  validationCheck(form: NgForm){
     if(this.uploader.queue.length == 0){
       this.ngbPopOverMessage = "No tracks were added.";
       this.ngbPopover.open();
       return;
     }
     this.emailCheck(form);
  }

  emailCheck(form: NgForm){
     if (form.controls.email_from.value && form.controls.email_from.invalid){
       this.ngbPopOverMessage = "Your email is invalid";
       this.ngbPopover.open();
     }
    else if (!form.controls.email_from.value && form.controls.email_from.invalid){
      this.ngbPopOverMessage = "Your email is missing";
       this.ngbPopover.open();
    }
    else{
       this.ngbPopover.close();
    }
  }

  availability: boolean = this.localStorageService.getAvailability() ? this.localStorageService.getAvailability(): false;
  notifications: boolean = this.localStorageService.getAvailability() ? this.localStorageService.getAvailability(): false;

  toggleDownload(){
    this.availability = !this.availability;
  }

  toggleNotifications(){
    this.notifications =  !this.notifications;
  }
  ngOnInit(): void {
    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          this.ngbPopOverMessage = "You exceeded the limit of 2 GB."
          break;
        case 'onlyAudio':
          this.ngbPopOverMessage = "One or more files are not supported and were not added.";
          break;
        case 'checkSizeLimit':
          this.ngbPopOverMessage = "You exceeded the limit of 2 GB.";
          break;
        default:
          this.ngbPopOverMessage = "Something went wrong, please try again.";
          break;
      }
      this.ngbPopover.open();
    };

    this.uploader.onAfterAddingAll = (item) => {
      this.ngbPopover.close();
    }

    window.addEventListener('dragenter', (e) => {
      this.showDropZone();
    });

    this.dropZone.nativeElement.addEventListener('dragleave', (e) => {
      this.hideDropZone();
    });

    this.dropZone.nativeElement.addEventListener('drop', () => this.hideDropZone());
  }

  showDropZone() {
    this.dropZone.nativeElement.style.visibility = "visible";
  }
  hideDropZone() {
    this.dropZone.nativeElement.style.visibility = "hidden";
  }


  constructor(private localStorageService: LocalStorageService) {
  }

  private clearForm(clearData): void {
    if (clearData) {
      this.notes = '';
      this.email_to = [];
    }
    this.uploadedFilesSize = 0;
    this.uploader.clearQueue();
    this.uploader.progress = 0;
  }

  private storePreferences() {
    this.localStorageService.storeEmailFrom(this.email_from);
    this.localStorageService.storeAvailability(this.availability);
    this.localStorageService.storeNotificationType(this.notifications);
  }

  getAcceptedFileTypes() {
    return PublicUploadPageComponent.ACCEPTED_FILE_TYPES;
  }

  removeFromQueue(item){
    this.uploader.removeFromQueue(item);
    this.removedFileSize.emit(item.file.size);
  }

  calculateTotalQueueSize() {
    let temp = 0;
    this.uploader.queue.forEach(item =>
      temp += item._file.size);
    return temp;
  }

}

@Directive({
  selector: '[emailValidationPopover]'
})

export class EmailValidationPopover {
  control: any;
  popover: NgbPopover;

  constructor(control: NgControl, popover: NgbPopover) {
    this.popover = popover;
    this.control = control;
    this.control.statusChanges.subscribe((status) => {
      if (control.dirty && control.invalid) {
      } else {
        popover.close();
      }
    });
  }



  @HostListener('focusout') onFocusOutMethod() {
    if (this.control.dirty && this.control.invalid && this.control.value) {
      this.popover.open();
    } else {
      this.popover.close();
    }
  }
}
