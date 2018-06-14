import {Component, OnInit} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Lame} from "node-lame";

const UPLOAD_FILES_ENDPOINT = 'http://03b19740.ngrok.io/rest/upload/file';

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent implements OnInit {

  notes: string;
  email_from: string;
  email_to: string;

  finished: boolean;

  public uploader: FileUploader = new FileUploader({
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

  protected convert(item: FileItem) {
    console.log("convert item: " + item.file.name);

    // const encoder = new Lame({
    //   "output": "./audio-files/demo.mp3",
    //   "bitrate": 192
    // }).setFile("./audio-files/demo.wav");
    //
    // encoder.encode()
    //   .then(() => {
    //     console.log("great success!")
    //   })
    //   .catch((error) => {
    //     console.log("error!")
    //   });
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit() {
    this.uploader.onBeforeUploadItem = fileItem => this.convert(fileItem);
    this.uploader.onCompleteAll = () => this.finished = true;
  }

  public onFormSubmit(): void {

    this.uploader.uploadAll();
  }
}
