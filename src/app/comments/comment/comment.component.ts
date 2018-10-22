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
  @Input() player: Player;
  @Input() search: string;

  reply: Comment;

  showReplies: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  newReply() {
    this.reply = new Comment();
    this.reply.parent_comment_id = this.comment.comment_id;
    this.reply.version_id = this.comment.version_id;
  }

  clearReply() {
    this.reply = null;
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time) + " ago";
  }

  goToCommentTime(comment: Comment) {

    this.player.seekTo(comment.start_time, this.player.play());
  }
}
