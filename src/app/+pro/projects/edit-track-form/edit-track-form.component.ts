import {Component, EventEmitter, Input, OnInit, Output, Version} from '@angular/core';
import {Track} from "../../../model/track";
import {TrackService} from "../../../services/track.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Utils} from '../../../app.component';
import {RestCall} from '../../../rest/rest-call';
import {ConfirmDialogService} from '../../../services/confirmation-dialog/confirmation-dialog.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-track-form',
  templateUrl: './edit-track-form.component.html',
  styleUrls: ['./edit-track-form.component.scss']
})
export class EditTrackFormComponent implements OnInit {

  constructor(
    protected trackService: TrackService,
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private modalService: NgbModal,
  ) {

  }

  @Input()
  track: Track;

  changedVersions = [];

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  title: string;
  visible = false;
  versions = 2;

  ngOnInit() {
      this.title = this.track.title;
      this.visible = this.track.visible;
  }

  async onSubmit() {
    await this.trackService.editTrack(
      this.track,
      this.title,
      this.visible,
    );
    await this.changedVersions.forEach(item=>{
      let version = this.track.versions[item];
      this.trackService.editVersion(version, version.downloadable, version.visibility, version.notes);
    }
    )
    this.save.emit();
  }

  trackByFn(index, item) {
    return item.version_id;  }

  toggleVisibility(i){
    this.track.versions[this.getInversedIndex(i)].visibility = Math.abs(this.track.versions[this.getInversedIndex(i)].visibility-1);
    this.editedVersion(i);
    return;
  }

  toggleDownloadable(i){
    this.track.versions[this.getInversedIndex(i)].downloadable = !this.track.versions[this.getInversedIndex(i)].downloadable;
    this.editedVersion(i);
    return;
  }

  editedVersion(i, new_notes?){
    let reversedIndex = this.getInversedIndex(i)
    this.track.versions[reversedIndex].notes = new_notes ? new_notes : this.track.versions[reversedIndex].notes;
    this.changedVersions.push(reversedIndex);
    this.changedVersions = this.changedVersions.filter((el, reversedIndex, a) => reversedIndex === a.indexOf(el))
  }

  getInversedIndex(i): number{
    return this.track.versions.length - 1 - i;
  }


  getFileSize(file) {
    if(file) {
      return Utils.getSizeHumanized(file.file_size);
    }
    else return '';
  }

  async deleteVersion(version){
    if(this.track.versions.length == 1) {
    const confirm: boolean = await this.confirmDialogService.confirm('You are about to delete the only version of a track.\n' +
      'All information about this track will be deleted, are you sure?', 'Yes', "No");
    if (confirm){
      await RestCall.deleteTrack(this.track.track_id).then(() => {
        this.router.navigate([`../pro/projects/${this.track.project.project_id}`]);
        this.modalService.dismissAll();
      })
    }

    }
    else{
      const confirm: boolean = await this.confirmDialogService.confirm('Are you sure you want to delete all content related with this version?\n' +
        'This operation cannot be undone.', 'Yes', "No");
      if (confirm) await RestCall.deleteVersion(version.version_id).then(()=>{
          this.track.versions = this.track.versions.filter(item => item.version_id != version.version_id);
        }
      )
    }
  }
}
