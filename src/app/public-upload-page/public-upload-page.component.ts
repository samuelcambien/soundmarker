import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from "../ng2-file-upload";

const UPLOAD_FILES_ENDPOINT = 'http://localhost:8080/rest/upload/file';


enum Status {
  SELECT_SONGS, UPLOADING_SONGS, GREAT_SUCCESS
}

@Component({
  selector: 'app-public-upload-page',
  templateUrl: './public-upload-page.component.html',
  styleUrls: ['./public-upload-page.component.scss']
})
export class PublicUploadPageComponent implements OnInit {

  public static ACCEPTED_FILE_TYPES: string[] =
    [
      "audio/wv",
      "audio/flac",
      "audio/wav",
      "audio/x-m4a",
      "audio/x-wav",
      "audio/x-aiff",
      "audio/mpeg",
      "audio/aiff",
      "audio/mp3",
      "audio/ogg",
      "audio/aac",
      "audio/m4a",
    ];

  error;


  uploader: FileUploader = new FileUploader({
    url: UPLOAD_FILES_ENDPOINT,
    disableMultipart: true,
    maxFileSize: 1000000000, // 1GB 1 000 000 000
    filters: [
      {
        name: 'avoidDuplicates',
        fn: item => this.uploader.queue.findIndex(
          ref => ref.file.name == item.name
            && ref.file.size == item.size
            && ref.file.type == item.type
            && ref.file.lastModifiedDate == item.lastModifiedDate
        ) < 0
      },
      {
        name: 'onlyAudio',
        fn: item => PublicUploadPageComponent.accept(item.type)
      },
      {
        name: 'checkSizeLimit',
        fn: item => {return this.acceptedQueueMargin + this.queueSizeRemaining - item.size > 0}
      }
    ],
  });

  link: string;
  
  period;
  statusEnum = Status;
  stage: Status = Status.SELECT_SONGS;

  acceptedQueueMargin = 80000000; // 80 MB
  soundmarkerLimit = 2000000000; //
  queueSizeRemaining: number; // 2000000000 2 000 000 000
  queueSizeRemainingString:  string = "2 GB";

  @ViewChild('waveform') waveform: ElementRef;

  constructor() {
  }

  ngOnInit() {
    this.uploader.files = 0;
    this.uploader.uploaded = 0;
    this.queueSizeRemaining = this.soundmarkerLimit;
    this.uploader.onAfterAddingFile = (item) => this.removeFileSize(item.file.size);
  }

  // Remove the size of a added file again to the leftover queuesize.
  removeFileSize(fileSize){
    this.queueSizeRemaining = this.queueSizeRemaining - fileSize;
    this.queueSizeRemainingString = this.bytesToSize(this.queueSizeRemaining);
  }

  // Add the size of a removed file again to the leftover queuesize.
  addFileSize(fileSize): void{
    this.queueSizeRemaining = this.queueSizeRemaining + fileSize;
    this.queueSizeRemainingString = this.bytesToSize(this.queueSizeRemaining);
  }

  // Convert the queue size left to a human readable string.
  bytesToSize(bytes: number): string {
    let sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes <= 0) {bytes=bytes+this.acceptedQueueMargin};
    let i = Math.floor(Math.log(bytes)/Math.log(1000));
    let p = Math.round(bytes/(Math.pow(1000, i))*100)/100;
    return p + " " + sizes[i];
  }

  tryAgain() {
    this.stage = this.statusEnum.SELECT_SONGS;
    this.queueSizeRemaining = this.soundmarkerLimit;
    this.queueSizeRemainingString = this.bytesToSize(this.queueSizeRemaining);
    this.error = null;
  }

  successfullUpload() {
    this.stage = this.statusEnum.GREAT_SUCCESS;
    this.uploader.clearQueue();
    this.uploader.uploaded = 0;
  }

  static accept(fileType: string): boolean {
    return PublicUploadPageComponent.ACCEPTED_FILE_TYPES.find(
      acceptedType => acceptedType == fileType
    ) != null;
  }
}
