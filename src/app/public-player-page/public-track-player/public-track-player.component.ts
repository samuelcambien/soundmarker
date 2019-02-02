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
import {Comment, CommentSorter} from "../../model/comment";
import {saveAs} from 'file-saver/FileSaver';
import {Version} from "../../model/version";
import {File} from "../../model/file";
import * as wave from "../../player/dist/player.js";
import {RestCall} from "../../rest/rest-call";
import {PlayerService} from "../../player.service";

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss']
})
export class PublicTrackPlayerComponent implements OnInit, AfterViewChecked {

  static MINIMAL_INTERVAL: number = 1;

  @Input() track: Track;
  @Input() enableOverview: boolean;
  @Input() expired: boolean = false;

  @Output() error = new EventEmitter();
  @Output() overview = new EventEmitter();

  @ViewChild('waveform') waveform: ElementRef;
  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;
  @ViewChild('phonesearch') phonesearch: ElementRef;

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

  version: Version;

  phoneSearch: boolean;
  phoneOrder: boolean;

  peaks;
  private files: File[];

  constructor(private playerService: PlayerService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (!this.expired) {
      this.track.versions.then(versions => {
        this.version = versions[0];
        this.comment.start_time = 0;
        this.comment.end_time = versions[0].track_length;
        this.peaks = JSON.parse(this.version.wave_png);
        return this.loadWaveForm();
      })
      // .catch(
      // e => {
      //   console.log(e);
      //   this.error.emit(e);
      // }
      // )
        .then(() =>
          setInterval(() => {
            this._progress = this.getCurrentTime();
          }, 1)
        );
    }
  }

  private getPlayerWidth(): number {
    return this.waveform && this.waveform.nativeElement.clientWidth;
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

  updateStartTime(x) {

    this.comment.include_start = true;
    this.comment.start_time = this.getValidStartTime(
      this.getCommentTime(this.startTime, x)
    );
  }

  private getValidStartTime(commentTime: number) {
    if (commentTime < 0) return 0;
    if (commentTime > this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL) return this.comment.end_time - PublicTrackPlayerComponent.MINIMAL_INTERVAL;
    return commentTime;
  }

  updateEndTime(x) {
    this.comment.include_end = true;
    this.comment.end_time = this.getValidEndTime(
      this.getCommentTime(this.endTime, x)
    );
  }

  private getValidEndTime(commentTime: number) {
    if (commentTime < this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL) return this.comment.start_time + PublicTrackPlayerComponent.MINIMAL_INTERVAL;
    if (commentTime > this.getTrackLength()) return this.getTrackLength();
    return commentTime;
  }

  play() {
    this.getPlayer().play();
  }

  pause() {
    this.getPlayer().pause();
  }

  isPlaying() {
    return this.getPlayer() && this.getPlayer().isPlaying();
  }

  getMatchingCommentsSorted(): Comment[] {

    return this.getMatchingComments().sort(this.currentSorter.comparator);
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  getMatchingComments(): Comment[] {

    if (!this.track.comments) return [];

    if (!this.search) return this.track.comments;

    let search = new RegExp(this.search, 'i');

    return this.track.comments.filter(
      comment => search.test(comment.notes) || search.test(comment.name)
    );
  }

  hasComments() {
    return this.track.comments && this.track.comments.length > 0;
  }

  hasMatchingComments() {
    return this.getMatchingComments().length > 0;
  }

  public loadWaveForm(): Promise<any> {

    return this.version.files.then((files) => {
      this.files = files;
      let streamFile = files.filter(file => file.identifier == 0)[0];
      this.playerService.addPlayer(this.track.track_id, wave.create(
        {
          container: "#waveform_" + this.track.track_id,
          peaks: this.peaks,
          duration: this.version.track_length,
          aws_path: streamFile.aws_path,
          extension: streamFile.extension
        }
      ));
      this.getPlayer().drawBuffer();
      this.getPlayer().backend.load();
      return this.getPlayer().backend.loadChunk(0);
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
    if (!element) return 0;
    return this.getPlayerWidth() && this.getTrackLength() ?
      this.getPlayerWidth() * commentTime / this.getTrackLength() - element.nativeElement.offsetWidth / 2 :
      -element.nativeElement.offsetWidth / 2;
  }

  private getSeekTime(event) {
    return this.getTrackLength() * (event.x - this.waveform.nativeElement.getBoundingClientRect().left) / this.getPlayerWidth();
  }

  private getCommentTime(element, x) {

    return this.getTrackLength() * (x + element.nativeElement.offsetWidth / 2 - this.getPlayerPosition()) / this.getPlayerWidth();
  }

  getTrackLength() {
    return this.version ? this.version.track_length : 100;
  }

  download() {

    window.open(
      this.files
        .filter(file => file.identifier == 1)
        .map(file => file.aws_path + '.' + file.extension)
        [0]
    );
  }

  downloadFile(propertyId: string, fileId: string) {
    this.download()
  }

  triggerPhoneSearch() {
    this.phoneSearch = !this.phoneSearch;
    if (this.phoneSearch) {
      setTimeout(() => this.phonesearch.nativeElement.focus(), 3);
    }
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
    this.track.comments.push(comment);
    RestCall.addComment(this.comment).then(response => {
      this.comment.comment_id = response["comment_id"];
      this.comment = new Comment();
      this.comment.start_time = 0;
      this.comment.end_time = this.getTrackLength();
    }).catch(() =>
      this.track.comments = this.track.comments.filter(
        loadedComment => loadedComment != comment
      )
    );
  }

  getPlayer() {
    return this.playerService.getPlayer(this.track.track_id);
  }

  dragStart() {
    this.comment.include_start = true;
  }

  isInViewport(waveform) {

    try {
      let bounding = waveform.nativeElement.getBoundingClientRect();
      let scrollPane = waveform.nativeElement.closest(".comments-scrolltainer");
      return bounding.top + bounding.height / 2 > scrollPane.getBoundingClientRect().top;
    } catch (e) {
      return true;
    }
  }

  scrollToTop(waveform) {
    waveform.nativeElement.closest(".comments-scrolltainer").scrollTop = 0;
  }

  playerIsReady(): boolean {
    return this.playerService.playerReady(this.track.track_id);
  }
}
