import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from "../ng2-file-upload";
import {FileLikeObject} from "../ng2-file-upload/file-upload/file-like-object.class";

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

  uploader: FileUploader = new FileUploader({
    url: UPLOAD_FILES_ENDPOINT,
    disableMultipart: true,
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
        fn: item => item.type.startsWith("audio/")
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
}
