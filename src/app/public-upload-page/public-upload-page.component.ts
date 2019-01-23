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
    queueLimit: 12,
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
        fn: item => PublicUploadPageComponent.accept(item.type)
      }
    ],
  });

  link: string;

  period;
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

  static accept(fileType: string): boolean {

    return PublicUploadPageComponent.ACCEPTED_FILE_TYPES.find(
      acceptedType => acceptedType == fileType
    ) != null;
  }
}
