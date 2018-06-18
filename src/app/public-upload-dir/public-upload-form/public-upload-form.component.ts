import {Component, OnInit} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import * as lamejs from "lamejs";

const UPLOAD_FILES_ENDPOINT = 'http://7c948483.ngrok.io/rest/upload/file';

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

    let mp3Data = [];

    let mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); //mono 44.1khz encode to 128kbps
    let mp3Tmp = mp3encoder.encodeBuffer(item); //encode mp3

    //Push encode buffer to mp3Data variable
    mp3Data.push(mp3Tmp);

    // Get end part of mp3
    mp3Tmp = mp3encoder.flush();

    // Write last data to the output data, too
    // mp3Data contains now the complete mp3Data
    mp3Data.push(mp3Tmp);

    console.debug(mp3Data);
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
