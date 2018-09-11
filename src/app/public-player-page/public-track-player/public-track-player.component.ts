import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Track} from "../../model/track";
import {Utils} from "../../app.component";
import {Player} from "../../newplayer/player";
import {Comment, CommentSorter} from "../../comments/comment";
import {saveAs} from 'file-saver/FileSaver';

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss']
})
export class PublicTrackPlayerComponent implements OnInit {

  public commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT_FIRST,
    CommentSorter.MOST_RECENT_LAST,
    CommentSorter.NAME_A_Z,
    CommentSorter.NAME_Z_A
  ];

  @Input() player: Player;
  @Input() track: Track;

  @Output() overview = new EventEmitter();
  @Output() playing = new EventEmitter();

  @ViewChild('waveform') waveform: ElementRef;

  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  private currentSorter: CommentSorter = CommentSorter.MOST_RECENT_FIRST;

  comment: Comment = new Comment();

  startPos;

  showComments: boolean = false;

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {

    this.renderer.listen(this.waveform.nativeElement, 'click', (e) => {
      this.player.seekTo(this.getSeekTime(e));
    });

    this.comment.start = 0;
    this.comment.end = this.track.duration;
  }

  private getPlayerWidth(): number {
    return this.waveform.nativeElement.clientWidth;
  }

  getStartPosition() {
    return this.getPosition(this.startTime, this.comment.start);
  }

  getEndPosition() {
    return this.getPosition(this.endTime, this.comment.end);
  }

  updateStartTime(startPos, current) {
    this.comment.includeStart = true;
    this.comment.start = this.getCommentTime(this.startTime, startPos, current);
  }

  updateEndTime(startPos, current) {
    this.comment.includeEnd = true;
    this.comment.end = this.getCommentTime(this.endTime, startPos, current);
  }

  play() {
    this.playing.emit();
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  isPlaying() {
    return this.player && this.player.isPlaying();
  }

  getCommentsSorted() {
    return this.track.comments ? this.track.comments.sort(this.currentSorter.comparator) : [];
  }

  saveDragStart(element, event) {
    console.log(event);
  }

  validateDragStart() {
    return () => true;
    // return (coords) =>
    //   this.getCommentTime(this.startTime, this.startPos, coords) > 0 &&
    //   (this.getCommentTime(this.startTime, this.startPos, coords) < this.comment.end || !this.comment.includeEnd) &&
    //   this.getCommentTime(this.startTime, this.startPos, coords) <= this.track.duration;
  }

  validateDragEnd() {
    return () => true;
    // return (coords) =>
    //   this.getCommentTime(this.endTime, this.startPos, coords) > 0 &&
    //   (this.getCommentTime(this.endTime, this.startPos, coords) > this.comment.start || !this.comment.start) &&
    //   this.getCommentTime(this.endTime, this.startPos, coords) <= this.track.duration;
  }

  private getPosition(element, commentTime) {
    return this.getPlayerWidth() && this.track.duration ?
      this.getPlayerWidth() * commentTime / this.track.duration - element.nativeElement.offsetWidth / 2 + "px" :
      -element.nativeElement.offsetWidth / 2 + "px";
  }

  private getSeekTime(event) {
    return this.track.duration * (event.x - this.waveform.nativeElement.getBoundingClientRect().left) / this.getPlayerWidth();
  }

  private getCommentTime(element, startPos, event) {

    return this.track.duration * (startPos + event.x + element.nativeElement.offsetWidth / 2) / this.getPlayerWidth();
  }

  mouseDown(event) {
    console.log(event);
  }

  formatTime(seconds) {
    return Utils.getTimeFormatted(seconds);
  }

  download() {

    Utils.sendGetDataRequest(this.track.track_url + ".mp3", [], "", (response, trackRequest) => {
      saveAs(new Blob(
        [
          trackRequest.responseText
        ],
        {
          type: trackRequest.getResponseHeader("content-type")
        }), this.track.title + ".mp3"
      )
    });
  }

  downloadFile(propertyId: string, fileId: string) {
    ReadableStream
  }

  goToOverview() {
    this.overview.emit();
  }
}
