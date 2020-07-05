import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Comment} from "../../model/comment";
import {Utils} from "../../app.component";
import {LocalStorageService} from "../../services/local-storage.service";
import {RestCall} from "../../rest/rest-call";
import {Version} from "../../model/version";
import {StateService} from "../../services/state.service";
import {AudioSource, Player} from "../../player/player.service";

@Component({
  selector: 'comment-lazy',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommentComponent implements OnInit{

  @Input() comment: Comment;
  @Input() audioSource: AudioSource;
  @Input() search: string;
  @Input() expired: boolean;
  @Output() delete = new EventEmitter<Comment>();
  @Output() scrollIntoReply = new EventEmitter<boolean>();

  reply: Comment;

  showReplies: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private player: Player,
    private stateService: StateService
  ) {
  }

  ngOnInit() {
  }

  @ViewChild('replyform') replyform;

  createReply() {
    this.reply = new Comment();
    this.reply.name = this.localStorageService.getCommentName();
    this.reply.parent_comment_id = this.comment.comment_id;
    this.reply.version_id = this.comment.version_id;
    this.showReplies = true;

    this.cdr.detectChanges();
    this.scrollIntoReply.emit(true);
    if (!this.isMobileDevice()) {
      setTimeout(() => this.replyform.focusOnInputDesktop());
      setTimeout(() => this.scrollIntoReply.emit(false),400);
    } else {
      this.replyform.focusOnInputMobile();
    }
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
        this.cdr.detectChanges();
      })
      .catch(() => {this.removeReply(reply);
    this.cdr.detectChanges();});
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

  async play() {
    this.stateService.setActiveComment(this.comment);
    await this.player.play(this.audioSource, this.comment.start_time);
  }

  stop() {
    this.player.pause();
    this.player.seekTo(this.audioSource, this.comment.start_time);
  }

  isPlaying() {
    return this.stateService.getActiveComment().getValue() == this.comment;
  }

  toggleLoop() {
    this.comment.loop = !this.comment.loop;
    this.cdr.detectChanges();
  }

  isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };

}
