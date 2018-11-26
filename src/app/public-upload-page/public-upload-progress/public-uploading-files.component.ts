import {Component, Input, OnInit} from '@angular/core';
import {FileUploader} from "../../ng2-file-upload";

@Component({
  selector: 'app-public-uploading-files',
  templateUrl: './public-uploading-files.component.html',
  styleUrls: ['./public-uploading-files.component.scss']
})
export class PublicUploadingFilesComponent implements OnInit {

  @Input() uploader: FileUploader;

  constructor() { }

  ngOnInit() {
  }

  getProgress() {
    return Math.round(95 * this.uploader.uploaded / this.uploader.files);
  }
}
