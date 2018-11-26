import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Track} from "../../model/track";
import {Player} from "../../newplayer/player";
import {Comment, CommentSorter} from "../../model/comment";
import {saveAs} from 'file-saver/FileSaver';
import {Version} from "../../model/version";
import * as wave from "../../player/dist/player.js";
import {RestCall} from "../../rest/rest-call";

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

  commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT,
    CommentSorter.TRACK_TIME,
    CommentSorter.NAME
  ];

  currentSorter: CommentSorter = CommentSorter.MOST_RECENT;

  comment: Comment = new Comment();

  search: string;

  startPos;
  endPos;

  phoneSearch: boolean;
  phoneOrder: boolean;

  showComments: boolean = false;
  private MINIMAL_INTERVAL: number = 2;

  version: Version;

  decentPlayer;

  phoneSearch: boolean;
  phoneOrder: boolean;

  constructor(
  ) {
  }

  ngOnInit() {
    this.track.versions.then(versions => {
      this.version = versions[0];
      this.comment.start_time = 0;
      this.comment.end_time = versions[0].track_length;
      this.loadWaveForm(this.waveform);
    });
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
    if (commentTime > this.getTrackLength()) return this.getTrackLength();
    return commentTime;
  }

  play() {
    this.playing.emit();
    this.decentPlayer.play();
    // this.player.play();
  }

  pause() {
    this.decentPlayer.pause();
    // this.player.pause();
  }

  isPlaying() {
    return this.decentPlayer && this.decentPlayer.isPlaying();
  }

  getMatchingCommentsSorted() {

    return this.getMatchingComments().sort(this.currentSorter.comparator);
  }

  getMatchingComments() {

    if (!this.track.comments) return [];

    if (!this.search) return this.track.comments;

    let search = new RegExp(this.search, 'i');

    return this.track.comments.filter(
      comment => search.test(comment.notes) || search.test(comment.name)
    );
  }

  public loadWaveForm(waveform: ElementRef) {

    this.version.files.then((files) => {
      this.decentPlayer = wave.create(
        {
          container: "#waveform_" + this.track.track_id
        }
      );
      this.decentPlayer.load(files.filter(file => file.extension == "mp3")[0].aws_path + "0.mp3");

      // this.renderer.listen(this.waveform.nativeElement, 'click', (e) => {
      //   this.decentPlayer.seekTo(this.getSeekTime(e));
      // });
    });

    // var context = this.waveform.nativeElement.getContext('2d');
    // var image = new Image();
    // image.onload = () => {
    //   context.drawImage(image, 0, 0, this.waveform.nativeElement.width, this.waveform.nativeElement.height);
    // };
    // this.track.versions
    //   .then((versions: Version[]) => {
    //     image.src = versions[0].wave_png;
    //
    //   });
  }

  getCurrentTime() {
    return this.decentPlayer != null ? this.decentPlayer.getCurrentTime() : 0;
  }

  private getPosition(element, commentTime) {
    return this.getRawPosition(element, commentTime) + "px";
  }

  private getRawPosition(element, commentTime): number {
    return this.getPlayerWidth() && this.getTrackLength() ?
      this.getPlayerWidth() * commentTime / this.getTrackLength() - element.nativeElement.offsetWidth / 2 :
      -element.nativeElement.offsetWidth / 2;
  }

  private getSeekTime(event) {
    return this.getTrackLength() * (event.x - this.waveform.nativeElement.getBoundingClientRect().left) / this.getPlayerWidth();
  }

  private getCommentTime(element, event) {

    return this.getTrackLength() * (event.x + element.nativeElement.offsetWidth / 2 - this.getPlayerPosition()) / this.getPlayerWidth();
  }

  getTrackLength() {
    return this.version ? this.version.track_length : 100;
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
    RestCall.addComment(this.comment).then(response => {
      this.comment.comment_id = response["comment_id"];
      this.track.comments.push(comment);

      this.comment = new Comment();
      this.comment.start_time = 0;
      this.comment.end_time = this.getTrackLength();
    });
  }
}
