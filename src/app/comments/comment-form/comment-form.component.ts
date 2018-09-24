import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../comment";
import {RestUrl, Utils} from "../../app.component";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Player} from "../../newplayer/player";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {

  active: boolean = false;

  @Input() version_id;
  @Input() comment: Comment;
  @Input() player: Player;

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.comment.time = Date.now();
    this.comment.version_id = this.version_id;
    Utils.sendPostRequest(
      RestUrl.COMMENTS,
      JSON.stringify(this.comment)
    );
    form.resetForm();
  }

  triggerStart() {
    if (!this.comment.start)
      this.comment.start = this.player.getCurrentPosition();
    if (this.comment.includeStart)
      this.comment.includeEnd = false;
  }

  triggerEnd() {
    if (!this.comment.end)
      this.comment.end = this.player.getCurrentPosition();
    if (this.comment.includeEnd)
      this.comment.end = this.player.getDuration();
    if (!this.comment.includeEnd)
      this.comment.includeStart = true;
  }

  format(time: string) {
    return Utils.getTimeFormatted(time);
  }
}
