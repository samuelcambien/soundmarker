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

  goToCommentTime(comment: Comment) {

    if (comment.include_start) {
      comment.include_end ?
        this.player.play(comment.start_time, comment.end_time) :
        this.player.play(comment.start_time);
    }
  }
}
