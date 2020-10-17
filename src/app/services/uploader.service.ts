import {Injectable} from '@angular/core';
import {FileUploader} from '../tools/ng2-file-upload';
import {Utils} from '../app.component';

export enum Status {
  UPLOAD_FORM, UPLOADING_SONGS, GREAT_SUCCESS
}

@Injectable({
  providedIn: 'root'
})

export class Uploader {
  fileUploaders: Array<SMFileUploader> = [];

  constructor() {
    this.newFileUploader();
  }

  fileUploader;

  newFileUploader() {
    let SMfileuploader = new SMFileUploader();
    this.fileUploaders.push(SMfileuploader);
    this.fileUploader = this.getOpenFileUploader();
  }

  getOpenFileUploader(): FileUploader {
    return this.getOpenSMFileUploader().getFileUploader();
  }

  getOpenSMFileUploader(): SMFileUploader {
    return this.fileUploaders[this.fileUploaders.length - 1]
  }

  isUploading(){
    return this.fileUploaders.filter(fileUploader => fileUploader.isUploading()).length;
  }

  isReady(){
    let readyUploaders = this.fileUploaders.filter(fileUploader => fileUploader.isReady()).length;
    let openUploaders = this.fileUploaders.filter(fileUploader => fileUploader.isUploading()).length;
   return (readyUploaders > 0 && openUploaders == 0);
  }

  clearFileUploaders(){
    this.fileUploaders = this.fileUploaders.filter(fileUploader => !fileUploader.isReady());
  }
}

export class SMFileUploader {
  notes: string;
  email_to: string[];
  project_title;

  // expirations = [{id: '1week', label: 'Week', heading: 'Expire*'}, {id: '1month', label: 'Month', heading: 'Expire*'}];
  expiration="1week";

  // availabilities = [{id: false, label: 'No', heading: 'Download*'}, {id: true, label: 'Yes', heading: 'Download*'}];
  availability = false;

  // smppw_enable = [{id: false, label: 'No', heading: 'Password*'}, {id: true, label: 'Yes', heading: 'Password*'}];
  smppw="";
  smppw_bool=false;

  // stream_types = [{id: false, label: 'Lossy', heading: 'Stream*'}, {id: true, label: 'Lossless', heading: 'Stream*'}];
  stream_type=false;

  statusEnum = Status;
  stage: Status = this.statusEnum.UPLOAD_FORM;

  acceptedQueueMargin = 80000000; // 80 MB
  titles = [];
  soundmarkerLimit = 2000000000; //
  queueSizeRemaining: number = 2000000000; // 2000000000 2 000 000 000
  queueSizeRemainingString: string = '2 GB';
  uploading: boolean = false;

  getAcceptedFileTypes() {
    return SMFileUploader.ACCEPTED_FILE_TYPES;
  }

  public static ACCEPTED_FILE_TYPES: string[] =
    [
      'audio/wv',
      'audio/flac',
      'audio/wav',
      'audio/x-m4a',
      'audio/x-wav',
      'audio/x-aiff',
      'audio/mpeg',
      'audio/aiff',
      'audio/mp3',
      'audio/ogg',
      'audio/aac',
      'audio/m4a',
    ];

  UPLOAD_FILES_ENDPOINT = 'http://localhost:8080/rest/upload/file';
  fileUploader: FileUploader;

  constructor() {
    this.fileUploader = new FileUploader({
      url: this.UPLOAD_FILES_ENDPOINT,
      disableMultipart: true,
      maxFileSize: 2080000000, // 2GB 2 000 000 000 + 80 MB margin
      filters: [
        {
          name: 'avoidDuplicates',
          fn: item => this.getFileUploader().queue.findIndex(
            ref => ref.file.name == item.name
              && ref.file.size == item.size
              && ref.file.type == item.type
              && ref.file.lastModifiedDate == item.lastModifiedDate
          ) < 0
        },
        {
          name: 'onlyAudio',
          fn: item => this.accept(item.type)
        },
        {
          name: 'checkSizeLimit',
          fn: item => {
            return this.acceptedQueueMargin + this.queueSizeRemaining - item.size > 0;}
        }
      ]
    });
  }

  isUploading() {
    // return this.fileUploader.isUploading;
    return this.stage == Status.UPLOADING_SONGS;
  }

  getStage() {
    return this.stage;
  }

  isOpen() {
    return this.stage == Status.UPLOAD_FORM;
  }

  isReady() {
    return this.stage == Status.GREAT_SUCCESS;
  }

  setStatus(e) {
    this.stage = e;
  }

  getFileUploader() {
    return this.fileUploader;
  }

  getTitles() {
    return this.titles;
  }

// Remove the size of a added file again to the leftover queuesize.
  removeFileSize(fileSize) {
    this.queueSizeRemaining = this.queueSizeRemaining - fileSize;
    this.queueSizeRemainingString = Utils.getSizeHumanized(this.queueSizeRemaining);
  }

  // Add the size of a removed file again to the leftover queuesize.
  addFileSize(fileSize): void {
    this.queueSizeRemaining = this.queueSizeRemaining + fileSize;
    this.queueSizeRemainingString = Utils.getSizeHumanized(this.queueSizeRemaining);
  }

  accept(fileType: string): boolean {
    return SMFileUploader.ACCEPTED_FILE_TYPES.find(
      acceptedType => acceptedType == fileType
    ) != null;
  }

  resetSMFileUploader() {
    this.getFileUploader().clearQueue();
    this.getFileUploader().uploaded = 0;
    this.titles = [];
    this.notes = "";
    this.project_title = "";
    this.email_to = [];

  }

  addTitles(items) {
    let new_titles = items.map(a => a._file.name);
    this.titles = this.titles.concat(new_titles);
  }

  getTitle(track) {
    return this.titles[this.getFileUploader().getIndexOfItem(track)];
  }

  getProjectTitle(){
    return this.project_title;
  }

  getProjectNotes(){
    return this.notes;
  }

  getReceivers(){
    return this.email_to;
  }

  getExpiration(){
    return this.expiration;
  }

  getAvailability(){
    return this.availability;
  }

  getType(){
    return this.stream_type;
  }

  getSMPPW(){
    return this.smppw;
  }

  removeFromQueue(item) {
    this.titles.splice(this.getFileUploader().getIndexOfItem(item), 1);
    this.getFileUploader().removeFromQueue(item);
    this.removeFileSize(item.file.size);
  }

  //In use in HTML code. Do not delete, not recognized by IntelliJ parser.
  toggleAvailability(){
    this.availability = !this.availability;
  }

  toggleSMPpw() {
    this.smppw_bool = !this.smppw_bool;
  }

  toggleStreamType(){
      this.stream_type = !this.stream_type;
    }

}
