import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Track} from "../../model/track";
import {Comment, CommentSorter} from "../../model/comment";
import {saveAs} from 'file-saver/FileSaver';
import {Version} from "../../model/version";
import {File} from "../../model/file";
import {RestCall} from "../../rest/rest-call";
import {PlayerService} from "../../services/player.service";
import {ProjectService} from "../../services/project.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {Player} from "../../player";

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss']
})
export class PublicTrackPlayerComponent implements OnInit, AfterViewChecked, OnChanges  {

  static MINIMAL_INTERVAL: number = 1;

  @Input() track: Track;
  @Input() enableOverview: boolean;
  @Input() expired: boolean = false;
  @Input() launchTitleScroll: boolean;

  @Output() error = new EventEmitter();
  @Output() overview = new EventEmitter();

  @ViewChild('waveform') waveform: ElementRef;
  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;
  @ViewChild('phoneSearchInput') phoneSearchInput: ElementRef;
  @ViewChild('trackTitle') trackTitleDOM: ElementRef;

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
  phoneOrder: boolean;

  peaks;
  private files: File[];

  constructor(
    private localStorageService: LocalStorageService,
    private playerService: PlayerService,
    private projectService: ProjectService,
    private cdRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    if (!this.expired) {
      this.track.versions.then(versions => {
        this.version = versions[0];
        this.peaks = JSON.parse(this.version.wave_png);
        this.createNewComment();
        return this.loadPlayer();
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
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
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

  public loadPlayer(): Promise<void> {

    return this.version.files.then((files) => {
      this.files = files;

      const streamFile = files.filter(file => file.identifier == 0)[0];
      const player = new Player("waveform_" + this.track.track_id, this.peaks, this.version.track_length, streamFile.aws_path, streamFile.extension);

      this.playerService.addPlayer(this.track.track_id, player);

      player.finished.subscribe(() => {
        if (this.projectService.autoPlay) {
          this.projectService.playNextTrack(this.track);
        }
      });

      player.playing.subscribe(() => {
        this.playerService.stopAllExcept(player);
      })
    });
  }

  getCurrentTime(): number {
    return this.getPlayer() != null ? this.getPlayer().getCurrentTime() : 0;
  }

  getDuration(): number {
    return this.version && this.version.track_length;
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
    );}

  showPhoneSearch() {
    document.getElementById("phonesearch").setAttribute("style","display:inline-block");
    this.phoneSearchInput.nativeElement.focus();
  }

  clearSearch(){
    this.search = null;
    this.phoneSearchInput.nativeElement.focus();
  }

  hidePhoneSearch(event) {
    if(event.relatedTarget && (event.relatedTarget.getAttribute('id') === "phonesearch")){
      this.phoneSearchInput.nativeElement.focus(); //in case the search field is cleared or the search icon is clicker: re-focus on the search field.
    }
    else {
      document.getElementById("phonesearch").setAttribute("style", "display:none");
    }
  }

  goToOverview() {
    this.clearScroll();
    this.overview.emit();
  }

  getCommentIntervalWidth() {
    return this.getEndPositionRaw() - this.getStartPositionRaw() + "px";
  }

  playInterval() {

  }

  createNewComment() {
    this.comment = new Comment();
    this.comment.name = this.localStorageService.getCommentName();
    this.comment.start_time = 0;
    this.comment.end_time = this.getTrackLength();
  }

  addComment(comment: Comment) {
    this.track.comments.push(comment);
    this.localStorageService.storeCommentName(comment.name);
    RestCall.addComment(this.comment)
      .then(response => {
        this.comment.comment_id = response["comment_id"];
        this.comment.deleteable = true;
        this.createNewComment();
      })
      .catch(() =>
        this.removeComment(comment)
      );
  }

  removeComment(comment: Comment) {
    this.track.comments = this.track.comments.filter(
      loadedComment => loadedComment != comment
    );
  }

  deleteComment(comment: Comment) {
    RestCall.deleteComment(comment.comment_id);
    this.removeComment(comment);
  }

  getPlayer(): Player {
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////  SCROLLING OF LONG TITLES ////////////////////////////////////

  scrollTitleRunning: boolean = false;
  autoScrollTimeOut = setTimeout(()=>{},10);
  scrollIntervalID; // To reset the TrackTitleScrolling

  scrollInitialWait: number= 2000;
  scrollInterval: number= 48;
  scrollWaitAtEnd: number= 83;
  scrollWaitOnHover: number = 125;

  //Function that does the actual scrolling back and forth of too long titles.
  scrollTitle = () => {
    this.scrollTitleRunning = true;
    let i = 1;
    let titleScrollDiv = this.trackTitleDOM.nativeElement.scrollWidth - this.trackTitleDOM.nativeElement.offsetWidth + this.scrollWaitAtEnd;
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: none");
    this.scrollIntervalID = setInterval(() => {
      this.trackTitleDOM.nativeElement.scrollLeft += i;
      titleScrollDiv -= 1;
      if (titleScrollDiv === 0) {
        titleScrollDiv = this.trackTitleDOM.nativeElement.scrollLeft;
        if (i === -1) {
          clearInterval(this.scrollIntervalID);
          this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
          this.scrollTitleRunning = !this.scrollTitleRunning;
        }
        i = -i;
      }
    }, this.scrollInterval);
  }

  // When scrolling is not happening yet a mouseover event triggers the scrolling of too long titles.
  scrollTitleHover(){
    if(!this.scrollTitleRunning) {
      clearTimeout(this.autoScrollTimeOut);
      this.scrollTitleRunning = true;
      setTimeout(this.scrollTitle, this.scrollWaitOnHover);
    }
  }

  // Stop scrolling and reset the track title to it's start position.
  clearScroll() {
    this.trackTitleDOM.nativeElement.scrollLeft = this.trackTitleDOM.nativeElement.scrollLeft-this.trackTitleDOM.nativeElement.scrollLeft;
    this.scrollTitleRunning = false;
    clearInterval(this.scrollIntervalID);
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
  }

  // Hide the phonesearch in case the screen is resized while it was open.
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth > 577){
      document.getElementById("phonesearch").setAttribute("style","display:none");
    }
  }

  // Detect changes of input variables on the component.
  // Launches auto scrolling when opening a track.
  ngOnChanges(changes){
    if(this.launchTitleScroll) {
      this.autoScrollTimeOut = setTimeout(this.scrollTitle, this.scrollInitialWait);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
}
