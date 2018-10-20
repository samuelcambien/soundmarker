import {Component, Input} from '@angular/core';
import {FileItem, FileUploader} from '../../ng2-file-upload';
import {Mp3Encoder} from "../../mp3-encoder/mp3-encoder";
import {RestUrl, Utils} from "../../app.component";

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
    let type = "flac", converter: Function;

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
      // this.uploader.uploadAll();
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

    Utils.sendPostRequest(RestUrl.PROJECT_NEW, {})
      .then(response => {

        let project_id = response["project_id"];
        this.uploader.queue.forEach(track => {

          Utils.sendPostRequest(RestUrl.TRACK_NEW, {
            project_id: project_id,
            title: track._file.name
          }).then(response =>
            Utils.sendPostRequest(RestUrl.VERSION_NEW, {
              track_id: response["track_id"]
            })
          ).then(response =>
            Utils.sendPostRequest(RestUrl.UPLOAD, {
              version_id: response["version_id"],
              identifier: 0,
              track_length: 15,
              chunk_length: 10,
              file_name: track._file.name,
              file_size: 5000,
              waveform_png: 123456789
            })
          );

          this.convert(track);

        });

        Utils.sendPostRequest(RestUrl.PROJECT_SHARE, {
          project_id: project_id,
          sender: this.email_from,
          receiver: this.email_to
        }).then(response => this.project_url = response["project_url"]);

      });
  }
}
