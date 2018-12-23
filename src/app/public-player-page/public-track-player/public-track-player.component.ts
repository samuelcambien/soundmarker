import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Track} from "../../model/track";
import {Player} from "../../newplayer/player";
import {Comment, CommentSorter} from "../../model/comment";
import {saveAs} from 'file-saver/FileSaver';
import {Version} from "../../model/version";
import {File} from "../../model/file";
import * as wave from "../../player/dist/player.js";
import {RestCall} from "../../rest/rest-call";
import {PlayerService} from "../../player.service";
import {Utils} from "../../app.component";

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss']
})
export class PublicTrackPlayerComponent implements OnInit, AfterViewChecked {

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

  _progress: number;

  startPos;
  endPos;

  showComments: boolean = false;
  private MINIMAL_INTERVAL: number = 2;

  version: Version;

  phoneSearch: boolean;
  phoneOrder: boolean;

  peaks;
  private files: File[];

  constructor(private playerService: PlayerService, private cdRef:ChangeDetectorRef, zone: NgZone) {
    setInterval(() => {
      this._progress = this.getCurrentTime();
    }, 1);
  }

  ngOnInit() {
    this.track.versions.then(versions => {
      this.version = versions[0];
      this.comment.start_time = 0;
      this.comment.end_time = versions[0].track_length;
      RestCall.getWaveform(this.track.track_id)
        .then((response) => {
          this.peaks = response[0]["peaks"];
          this.loadWaveForm();
        });
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
    this.getPlayer().play();
    // this.player.play();
  }

  pause() {
    this.getPlayer().pause();
  }

  isPlaying() {
    return this.getPlayer() && this.getPlayer().isPlaying();
  }

  getMatchingCommentsSorted() {

    return this.getMatchingComments().sort(this.currentSorter.comparator);
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  getMatchingComments() {

    if (!this.track.comments) return [];

    if (!this.search) return this.track.comments;

    let search = new RegExp(this.search, 'i');

    return this.track.comments.filter(
      comment => search.test(comment.notes) || search.test(comment.name)
    );
  }

  public loadWaveForm() {

    this.version.files.then((files) => {
      this.files = files;
      this.playerService.addPlayer(this.track.track_id, wave.create(
        {
          container: "#waveform_" + this.track.track_id,
          // peaks: this.version.wave_png,
          peaks: this.peaks,
          duration: this.version.track_length,
          aws_path: files.filter(file => file.identifier == 1)[0].aws_path
          // aws_path: "https://d3k08uu3zdbsgq.cloudfront.net/Zelmar-LetYouGo"
        }
      ));
      // this.getPlayer().load(files.filter(file => file.extension == "m4a")[0].aws_path + "0.m4a");
      // this.getPlayer().load("https://s3-eu-west-1.amazonaws.com/soundmarkersass-local-robin/608/06%20-%20Redbone0.mp3");
      this.getPlayer().drawBuffer();
      this.getPlayer().backend.load();
      this.getPlayer().backend.loadChunk(0);
    });
  }

  getCurrentTime(): number {
    return this.getPlayer() != null ? this.getPlayer().getCurrentTime() : 0;
  }

  getCurrentTimeRounded() {
    return Math.round(this.getCurrentTime());
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

    Utils.sendGetDataRequest(this.files.filter(file => file.identifier == 1)[0].aws_path, [])
      .then((response) => {
      saveAs(new Blob(
        [
          response
        ],
        {
          // type: trackRequest.getResponseHeader("content-type")
        }), this.track.title + ".mp3"
      )
    });
  }

  downloadFile(propertyId: string, fileId: string) {
    this.download()
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

  private getPlayer() {
    return this.playerService.getPlayer(this.track.track_id);
  }
}
