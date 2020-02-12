import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from "../../tools/ng2-file-upload";

enum Status {
  UPLOAD_FORM, UPLOADING_SONGS, GREAT_SUCCESS
}

@Component({
  selector: 'app-pro-upload-page',
  templateUrl: './pro-upload-page.component.html',
  styleUrls: ['./pro-upload-page.component.scss']
})
export class ProUploadPageComponent implements OnInit {

  link: string;

  error;

  period;
  statusEnum = Status;
  stage: Status = Status.UPLOAD_FORM;

  @ViewChild('waveform') waveform: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  successfullUpload() {
    this.stage = this.statusEnum.GREAT_SUCCESS;
    // this.uploader.clearQueue();
    // this.uploader.uploaded = 0;
  }


}
