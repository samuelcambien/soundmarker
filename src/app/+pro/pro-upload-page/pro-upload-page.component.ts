import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from "../../tools/ng2-file-upload";
import {Uploader} from '../../services/uploader.service';

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
  stage: Status = this.statusEnum.UPLOAD_FORM;

  @ViewChild('waveform') waveform: ElementRef;

  constructor(private uploader: Uploader) {
  }

  ngOnInit() {
    if(this.uploader.fileUploader.isUploading) this.stage = this.statusEnum.UPLOADING_SONGS;
  }

  successfullUpload() {
    this.stage = this.statusEnum.GREAT_SUCCESS;
    this.uploader.fileUploader.clearQueue();
    this.uploader.fileUploader.uploaded = 0;
  }
}
