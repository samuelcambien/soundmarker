import {Component, Input, OnInit} from '@angular/core';
import {FileUploader} from "../../../tools/ng2-file-upload";

@Component({
  selector: 'app-pro-uploading-files',
  templateUrl: './pro-uploading-files.component.html',
  styleUrls: ['./pro-uploading-files.component.scss']
})
export class ProUploadingFilesComponent implements OnInit {

  @Input() uploader: FileUploader;

  constructor() { }

  ngOnInit() {
  }

  getProgress() {
    return this.uploader.progress * 0.99;
  }
}
