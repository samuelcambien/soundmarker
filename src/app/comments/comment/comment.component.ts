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

  @ViewChild('reply', { read: ViewContainerRef }) reply: ViewContainerRef;

  showReplies: boolean = false;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {
  }

  showReplyForm() {
    this.reply.clear();
    this.reply.createComponent(
      this.cfr.resolveComponentFactory(
        ReplyFormComponent
      )
    ).instance.parentId = this.comment.comment_id;
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time) + " ago";
  }

  goToCommentTime(comment: Comment) {

    this.player.seekTo(comment.start, this.player.play());
  }
}
