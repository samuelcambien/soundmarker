import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../model/comment";
import {PublicTrackPlayerComponent} from "../../public-player-page/public-track-player/public-track-player.component";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {

  active: boolean = false;

  @Input() version_id;
  @Input() comment: Comment;
  @Input() player;
  @Output() newComment = new EventEmitter<Comment>();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.comment.comment_time = Date.now();
    this.comment.version_id = this.version_id;
    if (!this.comment.include_start) delete this.comment.start_time;
    if (!this.comment.include_end) delete this.comment.end_time;
    this.active = false;
    this.newComment.emit(this.comment);
    this.comment = new Comment();
  }

  triggerStart() {
    if (!this.comment.start_time)
      this.comment.start_time = this.player.getCurrentTime();
    if (!this.comment.include_start) {
      this.comment.include_end = false;
      this.resetEnd();
    }
  }

  triggerEnd() {
    if (!this.comment.include_end)
      this.resetEnd();
    if (this.comment.include_end) {
      this.comment.include_start = true;
      this.triggerStart();
    }
  }

  private resetEnd() {
    this.comment.end_time = this.player.getDuration();
  }

  updateStartTime(time) {

    this.comment.start_time = time;
    this.comment.include_start = true;
    this.triggerStart();
  }

  public isValidStartTime = (time) =>
    time >= 0
    && (time <= this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL);

  updateEndTime(time) {

    this.comment.end_time = time;
    this.comment.include_end = true;
    this.triggerEnd();
  }

  public isValidEndTime = (time) =>
    time >= this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL
    && time <= this.player.duration;
}
