import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SMFileUploader, Status, Uploader} from '../../../services/uploader.service';
import {RestCall} from '../../../rest/rest-call';
import {ProjectService} from '../../../services/project.service';
import {ConfirmDialogService} from '../../../services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-pro-upload-popover',
  templateUrl: './pro-upload-popover.component.html',
  styleUrls: ['./pro-upload-popover.component.scss'],
})

export class ProUploadPopoverComponent implements OnInit {

  @Input() link?;
  @Output() sendNewFiles= new EventEmitter();
  @Input() period?: string;
  @Output() close = new EventEmitter();

  constructor(private uploader: Uploader,
  private projectService: ProjectService,
  private confirmDialogService: ConfirmDialogService) { }

  ngOnInit() {
  }

  getProgress(e: SMFileUploader) {
   return e.getFileUploader().progress * 0.99;
  }

  getLink(smFileUploader) {
    return "projects/" + smFileUploader.getProjectHash();
  }

  getFileUploaders() {
    return this.uploader.fileUploaders;
  }

  async closePopover() {
    if(this.uploader.isUploading()){
      const confirm: boolean = await this.confirmDialogService.confirm('Are you sure you want to cancel all uploading projects?', 'Yes', "No");
      if (confirm) {
        this.uploader.uploadingFileUploaders().forEach(item => this.cancelUpload(item, true));
      }
    }
    else {
      this.close.emit();
    }
  }

  async cancelUpload(smFileUploader, confirmed?){
    const confirm: boolean = await this.confirmDialogService.confirm('Are you sure you want to cancel this upload?', 'Yes', "No");
    if (confirm || confirmed) {
      smFileUploader.setStatus(Status.CANCELLED);
      smFileUploader.getFileUploader().cancelAll();
      smFileUploader.getFileUploader().clearQueue();
      smFileUploader.newly_uploaded_tracks.forEach(trackId => RestCall.deleteTrack(trackId));
      smFileUploader.newly_uploaded_versions.forEach(versionId => {
        RestCall.deleteVersion(versionId);
      });
      if (smFileUploader.new_project) {
        await this.projectService.removeProject(smFileUploader.project_id);
        RestCall.deleteProject();
      }
      smFileUploader.resetSMFileUploader();
      this.uploader.removeCancelled(smFileUploader);
    }
  }

  removeSmFileUploadPopover(smFileUploader){
    this.uploader.fileUploaders = this.uploader.getFileUploaders().filter(e => e != smFileUploader);
  }
}
