import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../model/comment";
import {Utils} from "../../app.component";
import {LocalStorageService} from "../../services/local-storage.service";
import {RestCall} from "../../rest/rest-call";
import {Player} from "../../player";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() player: Player;
  @Input() search: string;
  @Input() expired: boolean;
  @Output() delete = new EventEmitter<Comment>();

  reply: Comment;

  showReplies: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  createReply() {
    this.reply = new Comment();
    this.reply.name = this.localStorageService.getCommentName();
    this.reply.parent_comment_id = this.comment.comment_id;
    this.reply.version_id = this.comment.version_id;
    this.showReplies = true;
  }

  clearReply() {
    this.reply = null;
  }

  newReply() {
    let reply = this.reply;
    this.clearReply();
    this.localStorageService.storeCommentName(reply.name);
    this.comment.replies.push(reply);
    RestCall.addComment(reply)
      .then(response => {
        reply.comment_id = response["comment_id"];
        reply.deleteable = true;
      })
      .catch(() => this.removeReply(reply));
  }

  removeReply(reply: Comment) {
    this.comment.replies = this.comment.replies.filter(
      loadedReply => loadedReply != reply
    );
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time);
  }

  getTimeAccurate(time: number) {
    return Utils.getTimeAccurate(time);
  }

  play() {
    this.player.play(this.comment);
  }

  stop() {
    this.player.pause();
    this.player.seekTo(this.comment.start_time);
  }

  isPlaying() {
    return this.player && this.player.getComment() == this.comment;
  }

  toggleLoop() {
    this.comment.loop = !this.comment.loop;
    this.cdr.detectChanges();
  }
}
