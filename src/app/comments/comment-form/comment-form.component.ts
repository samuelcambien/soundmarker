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
      this.setStartTime(this.player.getCurrentTime());
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

  setStartTime(time) {
    this.comment.start_time = this.getValidStartTime(time);
  }

  updateStartTime(time) {

    this.setStartTime(time);
    this.comment.include_start = true;
    this.triggerStart();
  }

  private getValidStartTime(time: number) {
    if (time < 0)
      return 0;
    if (time > this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL)
      return this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL;
    return time;
  }

  public isValidStartTime = (time) =>
    time >= 0
    && (time <= this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL);

  setEndTime(time: number) {
    this.comment.end_time = this.getValidEndTime(time);
  }

  updateEndTime(time) {

    this.setEndTime(this.getValidEndTime(time));
    this.comment.include_end = true;
    this.triggerEnd();
  }

  private getValidEndTime(time: number) {
    if (time < this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL)
      return this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL;
    if (time > this.player.duration)
      return this.player.duration;
    return time;
  }

  public isValidEndTime = (time) =>
    time >= this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL
    && time <= this.player.duration;
}
