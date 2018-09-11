import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Track} from "../../model/track";
import {RestUrl, Utils} from "../../app.component";
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

  @Input() track: Track;

  @ViewChild('waveform') waveform: ElementRef;

  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  private currentSorter: CommentSorter = CommentSorter.MOST_RECENT_FIRST;

  comments: Comment[];

  comment: Comment = new Comment();

  startPos;

  showComments: boolean = true;

  player: Player;

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {

    this.player = new Player(this.track.track_url, this.track.duration);

    this.renderer.listen(this.waveform.nativeElement, 'click', (e) => {
      this.player.seekTo(this.getSeekTime(e));
    });
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
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  isPlaying() {
    return this.player && this.player.isPlaying();
  }

  getCommentsSorted() {
    return this.comments ? this.comments.sort(this.currentSorter.comparator) : [];
  }

  saveDragStart(element, event) {
    console.log(event);
  }

  validateDragStart() {
    return () => true;
    // return (coords) =>
    // this.getCommentTime(this.startTime, coords) > 0 &&
    // (this.getCommentTime(this.startTime, coords) < this.comment.end || !this.comment.includeEnd) &&
    // this.getCommentTime(this.startTime, coords) <= this.track.duration;
  }

  validateDragEnd() {
    // return (coords) =>
    // this.getCommentTime(this.endTime, coords) > 0 &&
    // (this.getCommentTime(this.endTime, coords) > this.comment.start || !this.comment.start) &&
    // this.getCommentTime(this.endTime, coords) <= this.track.duration;
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
    saveAs(new Blob([
        Utils.sendGetRequest(RestUrl.VERSION, [], "", {})
      ],
      {type: "text/plain;charset=utf-8"}), "hello world.txt"
    );
  }

  downloadFile(propertyId: string, fileId: string) {
    ReadableStream
  }
}
