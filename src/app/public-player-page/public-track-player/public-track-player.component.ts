import {
  ChangeDetectionStrategy,
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
import {Version} from "../../model/version";
import {File} from "../../model/file";
import {RestCall} from "../../rest/rest-call";
import {PlayerService} from "../../services/player.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {Player} from "../../player";
import {trigger, state,  style,  animate,  transition} from '@angular/animations';

@Component({
  selector: 'app-public-track-player',
  templateUrl: './public-track-player.component.html',
  styleUrls: ['./public-track-player.component.scss'],
  animations: [
    trigger('openClose', [
      state('closed', style({
        transform: 'translateY(-100%)',
        display: 'none'
      })),
      state('open', style({
        transform: 'translateY(0%)',
        display: 'block'
      })),
      transition('open => closed', [
        animate('350ms ease-in')
      ]),
      transition('closed => open', [
        animate('250ms ease-in')
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicTrackPlayerComponent implements OnInit, OnChanges {

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
  waveformInViewPort = true;

  private files: File[];

  constructor(
    private localStorageService: LocalStorageService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) {
    document.addEventListener('scroll', ()=>{
      try {
          let bounding = this.waveform.nativeElement.getBoundingClientRect();
          let scrollPane = this.waveform.nativeElement.closest(".comments-scrolltainer");
          this.waveformInViewPort = bounding.top + bounding.height / 2 > scrollPane.getBoundingClientRect().top;
        }
      catch (e) {
        this.waveformInViewPort = true;}
        }, true);
  }

  ngOnInit(): void {
    this.waveformInViewPort = true;
    this.version = this.track.versions[0];
    setInterval(() => {
      this._progress = this.getCurrentTime();
      this.cdr.detectChanges();
    }, 1);
    this.playerService.getPlayer(this.track.track_id)
      .addWaveform(this.waveform.nativeElement);
    this.createNewComment();
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
    this.cdr.detectChanges();
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

  getMatchingComments(): Comment[] {

    if (!this.version.comments) return [];

    if (!this.search) return this.version.comments;

    let search = new RegExp(this.search, 'i');

    return this.version.comments.filter(
      comment => search.test(comment.notes) || search.test(comment.name)
    );
  }

  hasComments() {
    return this.version.comments && this.version.comments.length > 0;
  }

  hasMatchingComments() {
    return this.getMatchingComments().length > 0;
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
    else if(this.search == null) {
      document.getElementById("phonesearch").setAttribute("style", "display:none");
    }
  }

  // Separate function to go back to project overview to clear the browser history entry added when
  overviewByOverviewIconClick(){
    this.goToOverview();
    history.back();
  }

  goToOverview() {
    this.waveformInViewPort = true;
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
    this.version.comments.push(comment);
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
    if(!comment.parent_comment_id){
    this.version.comments = this.version.comments.filter(
      loadedComment => loadedComment != comment
    );}
    else {
      let a = this.version.comments.findIndex(loadedComment => {
        return loadedComment.comment_id == comment.parent_comment_id;
      });
      this.version.comments[a].replies = this.version.comments[a].replies.filter(
          loadedComment => loadedComment != comment
        );
    }
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

  scrollToTop() {
    this.waveformInViewPort = true;
    this.pauseTitleScroll= true;
    this.trackTitleDOM.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    setTimeout(()=>this.pauseTitleScroll = false,700);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////  SCROLLING OF LONG TITLES ////////////////////////////////////

  scrollInitialWait: number= 1250;
  scrollWaitAtEnd: number= 50;
  overflowTitle: boolean= false;
  scrollFPS = 45;
  pauseTitleScroll:boolean =  false;

  // Stop scrolling and reset the track title to it's start position.
  clearScroll() {
    this.trackTitleDOM.nativeElement.scrollLeft = 0;
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
    this.trackTitleDOM.nativeElement.removeEventListener("click", this.autoScroll);
    this.overflowTitle = false;
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
    this.waveformInViewPort = true;
    if(this.launchTitleScroll) {
      setTimeout(() => this.autoScroll(), this.scrollInitialWait);
    }
  }

  //Function that does the actual scrolling back and forth of too long titles.
  autoScroll = () => {
    if(this.trackTitleDOM.nativeElement.offsetWidth < this.trackTitleDOM.nativeElement.scrollWidth){ //Only run this function if there is actually a title which overflows the div.
      this.overflowTitle=false;

      this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: none");
      this.trackTitleDOM.nativeElement.removeEventListener("click", this.autoScroll);
      let titleScrollDiv = this.trackTitleDOM.nativeElement.scrollWidth - this.trackTitleDOM.nativeElement.offsetWidth + this.scrollWaitAtEnd;

      let i = 1;
      let scrollLoop = () => {
        setTimeout(()=>{
        titleScrollDiv -= 1;
        if(!this.pauseTitleScroll) this.trackTitleDOM.nativeElement.scrollLeft += i;
        if (titleScrollDiv > 0 && this.launchTitleScroll)
          requestAnimationFrame(scrollLoop);
        else if (titleScrollDiv === 0 && i === 1){
          titleScrollDiv = this.trackTitleDOM.nativeElement.scrollLeft;
          i=-i;
          requestAnimationFrame(scrollLoop);}
        else{
          this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
          this.trackTitleDOM.nativeElement.addEventListener("click", this.autoScroll);
          this.overflowTitle = true;
        }},1000/this.scrollFPS)
      };
      scrollLoop();
  };
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Catch back button when there is a project with multiple tracks to go back to overview instead of to previous website.
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.enableOverview){
      this.goToOverview();
    }
    else history.go(2);
  }
}
