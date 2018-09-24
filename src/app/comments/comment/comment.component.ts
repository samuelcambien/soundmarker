import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Comment} from "../comment";
import {ReplyFormComponent} from "../reply-form/reply-form.component";
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
    this.reply.parent_id = this.comment.comment_id;
  }

  clearReply() {
    this.reply = null;
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time) + " ago";
  }

  goToCommentTime(comment: Comment) {

    this.player.seekTo(comment.start, this.player.play());
  }
}
