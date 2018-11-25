import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Track} from "../../model/track";
import {Utils} from "../../app.component";
import {Player} from "../../newplayer/player";
import {Comment} from "../../model/comment";
import {saveAs} from 'file-saver/FileSaver';

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss']
})
export class PublicTrackPlayerComponent implements OnInit {

  @Input() player: Player;
  @Input() track: Track;
  @Input() enableOverview: boolean;

  @Output() overview = new EventEmitter();
  @Output() playing = new EventEmitter();

  @ViewChild('waveform') waveform: ElementRef;

  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  comment: Comment = new Comment();

  search: string;

  startPos;
  endPos;

  phoneSearch: boolean;
  phoneOrder: boolean;

  showComments: boolean = false;
  private MINIMAL_INTERVAL: number = 2;

  constructor(
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {

    this.renderer.listen(this.waveform.nativeElement, 'click', (e) => {
      this.player.seekTo(this.getSeekTime(e));
    });

    this.comment.start_time = 0;
    this.comment.end_time = this.track.duration;
  }

  private getPlayerWidth(): number {
    return this.waveform.nativeElement.clientWidth;
  }

  private getPlayerPosition(): number {
    return this.waveform.nativeElement.getBoundingClientRect().x;
  }

  getCommentIntervalPosition() {
    return this.getRawPosition(this.startTime, this.comment.start_time) + this.startTime.nativeElement.offsetWidth / 2 + "px";
  }

  getStartPosition() {
    return this.startPos ? this.startPos : this.getPosition(this.startTime, this.comment.start_time);
  }

  getEndPosition() {
    return this.endPos ? this.endPos : this.getPosition(this.endTime, this.comment.end_time);
  }

  getStartPositionRaw(): number {
    return this.getRawPosition(this.startTime, this.comment.start_time);
  }

  getEndPositionRaw(): number {
    return this.getRawPosition(this.endTime, this.comment.end_time);
  }

  updateStartTime(event) {
    this.comment.include_start = true;
    this.comment.start_time = this.getValidStartTime(
      this.getCommentTime(this.startTime, event)
    );
  }

  private getValidStartTime(commentTime: number) {
    if (commentTime < 0) return 0;
    if (commentTime > this.comment.end_time - this.MINIMAL_INTERVAL) return this.comment.end_time - this.MINIMAL_INTERVAL;
    return commentTime;
  }

  updateEndTime(endPos, current) {
    this.comment.include_end = true;
    this.comment.end_time = this.getValidEndTime(
      this.getCommentTime(this.endTime, current)
    );
  }

  private getValidEndTime(commentTime: number) {
    if (commentTime < this.comment.start_time + this.MINIMAL_INTERVAL) return this.comment.start_time + this.MINIMAL_INTERVAL;
    if (commentTime > this.track.duration) return this.track.duration;
    return commentTime;
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

  getMatchingCommentsSorted() {
    return this.getMatchingComments().sort((comment1, comment2) => comment2.comment_time - comment1.comment_time);
  }

  getMatchingComments() {

    if (!this.track.comments) return [];

    if (!this.search) return this.track.comments;

    let search = new RegExp(this.search, 'gi');

    return this.track.comments.filter(
      comment => search.test(comment.notes) || search.test(comment.name)
    );
  }

  private getPosition(element, commentTime) {
    return this.getRawPosition(element, commentTime) + "px";
  }

  private getRawPosition(element, commentTime): number {
    return this.getPlayerWidth() && this.track.duration ?
      this.getPlayerWidth() * commentTime / this.track.duration - element.nativeElement.offsetWidth / 2 :
      -element.nativeElement.offsetWidth / 2;
  }

  private getSeekTime(event) {
    return this.track.duration * (event.x - this.waveform.nativeElement.getBoundingClientRect().left) / this.getPlayerWidth();
  }

  private getCommentTime(element, event) {

    return this.track.duration * (event.x + element.nativeElement.offsetWidth / 2 - this.getPlayerPosition()) / this.getPlayerWidth();
  }

  mouseDown(event) {
    console.log(event);
  }

  download() {

    // Utils.sendGetDataRequest(this.track.track_url + ".mp3", [], "", (response, trackRequest) => {
    //   saveAs(new Blob(
    //     [
    //       trackRequest.responseText
    //     ],
    //     {
    //       type: trackRequest.getResponseHeader("content-type")
    //     }), this.track.title + ".mp3"
    //   )
    // });
  }

  downloadFile(propertyId: string, fileId: string) {
    ReadableStream
  }

  goToOverview() {
    this.overview.emit();
  }

  getCommentIntervalWidth() {
    return this.getEndPositionRaw() - this.getStartPositionRaw() + "px";
  }

  playInterval() {

  }

  addComment(comment: Comment) {
    this.comment = new Comment()
    this.track.comments.push(comment);
  }
}
