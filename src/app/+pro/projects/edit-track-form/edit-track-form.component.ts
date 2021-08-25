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
  visible;

  ngOnInit() {
      this.title = this.track.title;
      console.log(this.track.versions[0]);
  }

  async onSubmit() {
    await this.trackService.editTrack(
      this.track,
      this.title,
      this.visible,
    );
    this.save.emit();
  }

  trackByFn(index, item) {
    return index;  }

  toggleVisibility(i){
    this.track.versions[i].visibility = Math.abs(this.track.versions[i].visibility-1);
    this.editedVersion(i);
    return;
  }

  toggleDownloadable(i){
    this.track.versions[i].downloadable = !this.track.versions[i].downloadable;
    this.editedVersion(i);
    return;
  }

  editedVersion(i){
    this.changedVersions.push(i);
    this.changedVersions = this.changedVersions.filter((el, i, a) => i === a.indexOf(el))
  }

  getFileSize(file) {
    // console.log(file.file_size);
    if(file) {
      return Utils.getSizeHumanized(file.file_size);
    }
    else return '';
  }
}
