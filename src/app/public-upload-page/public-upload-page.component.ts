import {Component, OnInit} from '@angular/core';
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
export class PublicUploadPageComponent implements OnInit  {

  uploader: FileUploader = new FileUploader({
    url: UPLOAD_FILES_ENDPOINT,
    filters: [{
      name: 'avoidDuplicates',
      fn: item => this.uploader.queue.findIndex(
        ref => ref.file.name == item.name
          && ref.file.size == item.size
          && ref.file.type == item.type
          && ref.file.lastModifiedDate == item.lastModifiedDate
      ) < 0
    }],
  });

  statusEnum = Status;
  status: Status = Status.SELECT_SONGS;

  ngOnInit() {
    this.uploader.onCompleteAll = () => this.status = Status.GREAT_SUCCESS;
    this.uploader.onProgressAll = () => this.status = Status.UPLOADING_SONGS;
  }
}
