import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../model/comment";
import {Utils} from "../../app.component";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  @Input() player;
  @Input() search: string;
  @Input() expired: boolean;
  @Output() delete = new EventEmitter<Comment>();

  reply: Comment;

  showReplies: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
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
    this.localStorageService.storeCommentName(this.reply.name);
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
    return this.player && this.comment.comment_id && this.player.backend.getComment() === this.comment.comment_id;
  }

  playerIsReady(): boolean {
    return this.player ? this.player.isReady() : false;
  }
}
