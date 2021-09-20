import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../../model/track";
import {TrackService} from "../../../services/track.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Utils} from '../../../app.component';

@Component({
  selector: 'app-edit-track-form',
  templateUrl: './edit-track-form.component.html',
  styleUrls: ['./edit-track-form.component.scss']
})
export class EditTrackFormComponent implements OnInit {

  constructor(
    protected trackService: TrackService,
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
}
