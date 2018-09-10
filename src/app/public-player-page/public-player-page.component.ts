import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment, CommentSorter} from "../comments/comment";
import {RestUrl, Utils} from "../app.component";
import {saveAs} from 'file-saver/FileSaver';
import {Player} from "../newplayer/player";
import {Track} from "../newplayer/track";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  startPos;

  showComments: boolean = true;

  @ViewChild('waveform') waveform: ElementRef;

  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  comments: Comment[];

  comment: Comment = new Comment();

  track: Track;

  player: Player;

  public commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT_FIRST,
    CommentSorter.MOST_RECENT_LAST,
    CommentSorter.NAME_A_Z,
    CommentSorter.NAME_Z_A
  ];

  private currentSorter: CommentSorter = CommentSorter.MOST_RECENT_FIRST;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {
  }

  duration: any = 177;

  ngOnInit() {

    this.renderer.listen(this.waveform.nativeElement, 'click', (e) => {
      this.player.seekTo(this.getSeekTime(e));
    });

    this.route.params.subscribe(params => {
      this.loadTrackInfo(params['track_id']);
    });
  }

  private getPlayerWidth(): number {
    return this.waveform.nativeElement.clientWidth;
  }

  private loadTrackInfo(trackId: string) {
    let my = this;
    Utils.sendGetRequest(RestUrl.TRACK, [trackId], '"emailAddress":"george.washington@america.com"', (response) => {
      my.track = response[0];
      this.player = new Player("https://d3k08uu3zdbsgq.cloudfront.net/Zelmar-LetYouGo", this.duration);
      my.loadComments();
    });
  }

  private loadComments() {
    Utils.sendGetRequest(RestUrl.COMMENTS, [this.track.last_version], "", (response) => {
      this.comments = response;
      this.loadReplies();
    });
  }

  private loadReplies() {
    for (let comment of this.comments) {
      Utils.sendGetRequest(RestUrl.REPLIES, [comment.comment_id], "", (response) => {
        comment.replies = response;
      });
    }
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
    // this.getCommentTime(this.startTime, coords) <= this.duration;
  }

  validateDragEnd() {
    // return (coords) =>
    // this.getCommentTime(this.endTime, coords) > 0 &&
    // (this.getCommentTime(this.endTime, coords) > this.comment.start || !this.comment.start) &&
    // this.getCommentTime(this.endTime, coords) <= this.duration;
  }

  private getPosition(element, commentTime) {
    return this.getPlayerWidth() && this.duration ?
      this.getPlayerWidth() * commentTime / this.duration - element.nativeElement.offsetWidth / 2 + "px" :
      -element.nativeElement.offsetWidth / 2 + "px";
  }

  private getSeekTime(event) {
    return this.duration * (event.x - this.waveform.nativeElement.getBoundingClientRect().left) / this.getPlayerWidth();
  }

  private getCommentTime(element, startPos, event) {

    return this.duration * (startPos + event.x + element.nativeElement.offsetWidth / 2) / this.getPlayerWidth();
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

  getTracks(): Track[] {
    return [
      this.track,
      this.track,
      this.track,
      this.track,
      this.track
    ]
  }
}
