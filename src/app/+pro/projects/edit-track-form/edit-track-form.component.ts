import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../../model/track";
import {TrackService} from "../../../services/track.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

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
    console.log('visi');
    this.editedVersion(i);
    return;
  }

  toggleDownloadable(i){
    console.log('down');
    this.editedVersion(i);
    return;
  }

  editedVersion(i){
    this.changedVersions.push(i);
    this.changedVersions = this.changedVersions.filter((el, i, a) => i === a.indexOf(el))
  }
}
