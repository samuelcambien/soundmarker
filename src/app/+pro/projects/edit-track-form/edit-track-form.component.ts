import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../../model/track";
import {TrackService} from "../../../services/track.service";

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

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  title: string;
  visible: boolean;

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
    this.save.emit();
  }

  toggleVisibility(i){
    return;
  }
}
