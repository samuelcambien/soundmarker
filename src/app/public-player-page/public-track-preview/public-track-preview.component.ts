import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Track} from "../../model/track";
import {animate, transition, trigger} from "@angular/animations";
import {Version} from "../../model/version";
import {File} from "../../model/file";
import {Comment, CommentSorter} from "../../model/comment";
import {Utils} from "../../app.component";
import {Player} from "../../player.service";

@Component({
  selector: 'app-public-track-preview',
  templateUrl: './public-track-preview.component.html',
  styleUrls: ['./public-track-preview.component.scss'],
  animations: [
    trigger('toggleComments', [
      transition('* => *', animate('5000s'))
    ])
  ]
})
export class PublicTrackPreviewComponent implements OnInit {

  @Input() track: Track;
  @Input() expired: boolean;
  @Output() selected = new EventEmitter<Track>();

  @ViewChild('trackTitle') trackTitleDOM: ElementRef;

  version: Version;
  private files: File[];

  constructor(
    private player: Player,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.version = this.track.versions[0];
    this.files = this.version.files;
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
  }

  async play() {
    await this.player.play(this.version);
    this.cdr.detectChanges();
  }

  pause() {
    this.getPlayer().pause();
    this.cdr.detectChanges();
  }

  isPlaying() {
    return this.player.version == this.version && this.player.isPlaying();
  }

  private getPlayer() {
    return this.player;
  }

  trackSelected() {
    this.selected.emit(this.track);
  }

  download() {

    window.open(
      this.files
        .filter(file => file.identifier == 1)
        .map(file => file.aws_path + '.' + file.extension)
        [0]
    );
  }

  private getCommentsAndReplies(): Comment[] {

    return this.track && this.version.comments ?
      this.version.comments.reduce(
        (commentsAndReplies, comment) =>
          Array.prototype.concat(commentsAndReplies, comment, comment.replies),
        []
      ) : [];
  }

  getCommentCount() {

    return this.track && this.version.comments && this.version.comments.length;
  }

  getLastUpdated() {

    let commentsAndReplies = this.getCommentsAndReplies();

    return commentsAndReplies.length > 0 ?
      "· " + Utils.getTimeHumanized(
        commentsAndReplies.sort(CommentSorter.MOST_RECENT.comparator)[0].comment_time
      ) : "";
  }
}
