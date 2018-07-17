import {Component, Input, OnInit} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent {

  notes: string;
  email_from: string;
  email_to: string;

  @Input() uploader: FileUploader;

  protected convert(item: FileItem) {

    let type = "wav-other", converter: Function;

    switch (type) {
      case "wav-16bit":
        converter = Mp3Encoder.convertWav16bit;
        break;
      case "wav-other":
        converter = Mp3Encoder.convertWavOther;
        break;
      case "flac":
        converter = Mp3Encoder.convertFlac;
        break;
      case "alac":
        converter = Mp3Encoder.convertAlac;
        break;
      case "aiff":
        converter = Mp3Encoder.convertAiff;
    }

    converter(item._file, (file) => {
      this.uploader.addToQueue([file]);
      this.uploader.uploadAll();
      console.log("great success");
    });
  }

  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onSubmit() {
    this.uploader.queue.forEach(item => this.convert(item));
    this.uploader.uploadAll();
  }
}
