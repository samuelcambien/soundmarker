import {Component, ElementRef, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
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

  uploader_error_message: string;

  uploader: FileUploader = new FileUploader({
    url: UPLOAD_FILES_ENDPOINT,
    disableMultipart: true,
    queueLimit: 10,
    maxFileSize: 500000000, // 500MB 500 000 000
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
  }

  tryAgain() {
    this.stage = this.statusEnum.SELECT_SONGS;
    this.error = null;
  }

  successfullUpload() {
    this.stage = this.statusEnum.GREAT_SUCCESS;
    this.uploader.clearQueue();
  }
}
