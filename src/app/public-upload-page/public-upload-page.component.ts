import {Component, ElementRef, OnInit, ViewChild, EventEmitter} from '@angular/core';
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

  error;

  uploader: FileUploader = new FileUploader({
    url: UPLOAD_FILES_ENDPOINT,
    disableMultipart: true,
    queueLimit: 10,
    maxFileSize: 2000000000, // 2GB
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
        fn: item => {
          return item.type.startsWith("audio/")
        }
      }
    ],
  });

  link: string;

  statusEnum = Status;
  stage: Status = Status.SELECT_SONGS;

  @ViewChild('waveform') waveform: ElementRef;

  ngOnInit() {
    this.uploader.files = 0;
    this.uploader.uploaded = 0;
  }

  constructor() {

    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      let failed = false;
      if (filter) {
        switch (filter.name) {
          case 'queueLimit':
            message = 'Try again, max 30 tracks.';
            console.log(message);
            break;
          case 'fileSize':
            message = 'One of your tracks exceeded the limit of 500MB';
            break;
          default:
            message = 'Something went wrong, please try again.';
            break;
        }
      }
      return message;
    };
  }

  tryAgain() {
    this.stage = this.statusEnum.SELECT_SONGS;
    this.error = null;
  }

  successfullUpload() {
    this.stage = this.statusEnum.SELECT_SONGS;
    this.uploader.clearQueue();
  }
}
