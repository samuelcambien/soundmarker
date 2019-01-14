import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../../model/comment";
import {Player} from "../../newplayer/player";
import {Utils} from "../../app.component";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() player;
  @Input() search: string;

  reply: Comment;

  showReplies: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  createReply() {
    this.reply = new Comment();
    this.reply.parent_comment_id = this.comment.comment_id;
    this.reply.version_id = this.comment.version_id;
    this.showReplies = true;
  }

  clearReply() {
    this.reply = null;
  }

  newReply() {
    this.comment.replies.push(this.reply);
    this.clearReply();
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time) + " ago";
  }

  getTimeAccurate(time: number) {
    return Utils.getTimeAccurate(time);
  }

  play() {

    if (this.comment.include_start) {
      this.comment.include_end ?
        this.player.play(this.comment.start_time, this.comment.end_time, this.comment.comment_id) :
        this.player.play(this.comment.start_time, this.player.getDuration(), this.comment.comment_id);
    }
  }

  stop() {
    this.player.pause();
    this.player.seekTo(this.comment.start_time / this.player.getDuration());
  }

  isPlaying() {
    return this.player && this.player.backend.getComment() === this.comment.comment_id;
  }
}
