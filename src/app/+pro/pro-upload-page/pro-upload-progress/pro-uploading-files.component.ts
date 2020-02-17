import {Component, Input, OnInit} from '@angular/core';
import {Uploader} from '../../../services/uploader.service';

@Component({
  selector: 'app-pro-uploading-files',
  templateUrl: './pro-uploading-files.component.html',
  styleUrls: ['./pro-uploading-files.component.scss']
})
export class ProUploadingFilesComponent implements OnInit {

  constructor(private uploader: Uploader) { }

  ngOnInit() {
  }

  getProgress() {
    return this.uploader.fileUploader.progress * 0.99;
  }
}
