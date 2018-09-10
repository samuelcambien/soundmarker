import {Component, Input, OnInit} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestUrl, Utils} from "../../app.component";
import {parseHttpResponse} from "selenium-webdriver/http";

@Component({
  selector: 'app-public-upload-form',
  templateUrl: './public-upload-form.component.html',
  styleUrls: ['./public-upload-form.component.scss']
})
export class PublicUploadFormComponent {

  notes: string;
  email_from: string;
  email_to: [string];

  project_url: string;

  @Input() uploader: FileUploader;

  protected convert(item: FileItem) {

    // let type = "aiff", converter: Function;
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

    Utils.sendPostRequest(RestUrl.PROJECT_NEW, {}, response => {

      let project_id = response["project_id"];

      this.uploader.queue.forEach(track => {

        Utils.sendPostRequest(RestUrl.TRACK_NEW, {
          project_id: project_id,
          title: track._file.name,
        }, response => {

          let track_id = response["track_id"];

          Utils.sendPostRequest(RestUrl.VERSION_NEW, {
            track_id: 5,
            streamable: true,
            downloadable: false,
          })
        });

        this.convert(track);
        this.uploader.uploadAll();
      });

      Utils.sendPostRequest(RestUrl.PROJECT_URL, {
        project_id: project_id,
        sender: this.email_from,
        receiver: this.email_to
      }, response => this.project_url = response["project_url"])
    });
  }
}
