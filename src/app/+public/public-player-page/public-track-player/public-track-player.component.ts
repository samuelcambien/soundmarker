import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Track} from "../../../model/track";
import {Comment, CommentSorter} from "../../../model/comment";
import {Version} from "../../../model/version";
import {RestCall} from "../../../rest/rest-call";
import {LocalStorageService} from "../../../services/local-storage.service";
import {DrawerService} from "../../../services/drawer.service";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {State} from "../../../player/play-button/play-button.component";
import {AudioSource, Player} from "../../../player/player.service";
import {WaveformComponent} from './waveform/waveform.component';
import {ProjectService} from '../../../services/project.service';
import {StateService} from '../../../services/state.service';
import {Message} from '../../../message';
import {Utils} from '../../../app.component';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';
import {Status, Uploader} from '../../../services/uploader.service';

@Component({
  selector: 'public-track-player',
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
        animate('250ms ease-in')
      ]),
      transition('closed => open', [
        animate('250ms ease-in')
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicTrackPlayerComponent implements OnInit, OnChanges, AfterContentInit {

  static MINIMAL_INTERVAL: number = 1;

  @Input() track: Track;
  @Input() enableOverview: boolean;
  @Input() expired: boolean = true;
  @Input() trackActivated: boolean;
  @Input() sender?;
  @Input() expiry_date;

  private currentUser$;


  @Output() error = new EventEmitter();
  @Output() overview = new EventEmitter();

  @ViewChild('waveform', {static: false}) waveform: ElementRef;
  @ViewChild('startTime', {static: false}) startTime: ElementRef;
  @ViewChild('endTime', {static: false}) endTime: ElementRef;
  @ViewChild('phoneSearchInput', {static: false}) phoneSearchInput: ElementRef;
  @ViewChild('phonesearch', {static: false}) phonesearch: ElementRef;
  @ViewChild('trackTitle', {static: true}) trackTitleDOM: ElementRef;
  @ViewChild('markerPopover', {static: false}) markerPopover: NgbPopover;
  @ViewChild('appwaveform', {static: false}) appwaveform: WaveformComponent;

  commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT,
    CommentSorter.TRACK_TIME,
    CommentSorter.NAME
  ];

  currentSorter: CommentSorter = CommentSorter.MOST_RECENT;

  comment: Comment = new Comment();

  search: string;

  _currentTime: number = 0;

  startPos;
  endPos;

  version: Version;
  phoneOrder: boolean;
  waveformInViewPort = true;

  public notesCollapsed = true;

  waveformInViewPortObservable = new BehaviorSubject<boolean>(true);

  get notes(): string {
    return this.version.notes;
  }

  constructor(
    protected router: Router,
    protected uploader: Uploader,
    protected localStorageService: LocalStorageService,
    protected stateService: StateService,
    protected project: ProjectService,
    protected player: Player,
    protected drawerService: DrawerService,
    protected cdr: ChangeDetectorRef,
    protected ngDynamicBreadcrumbService: NgDynamicBreadcrumbService
  ) {

    document.addEventListener('scroll', () => {
      try {
        let bounding = this.waveform.nativeElement.getBoundingClientRect();
        if (bounding.y != 0) {
          let scrollPane = this.waveform.nativeElement.closest('.comments-scrolltainer');
          this.waveformInViewPort = bounding.top + bounding.height / 2 > scrollPane.getBoundingClientRect().top;
          this.waveformInViewPortObservable.next(this.waveformInViewPort);
        }
      } catch (e) {
        this.waveformInViewPort = true;
      }
    }, true);
    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
      this.router.navigate(['pro/upload'], {
        queryParams: {origin: 'dashboard', newTrackId: this.track.track_id},
        skipLocationChange: true
      });
      this.stateService.setVersionUpload(true);
      this.uploader.getOpenSMFileUploader().setStatus(Status.UPLOAD_FORM);
      this.uploader.getOpenSMFileUploader().addTitles(items);
    }
  }

  markerPopoverClose() {
    this.markerPopover.close();
    document.removeEventListener("click", () => this.markerPopoverClose())
  }

  ngOnInit(): void {
    this.track = Object.assign(new Track(), this.track);
    this.waveformInViewPort = true;
    this.version = this.stateService.getSelectedVersion(this.track) ? this.stateService.getSelectedVersion(this.track) : this.track.versions[0];
    this.stateService.setActiveVersion(this.version);
    this.player.progress.subscribe(e => {
      if (this.version === e.audioSource.version) {
        this._currentTime = e.currentTime;
        this.cdr.markForCheck();
      }
    });
    this.createNewComment();
    this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
    this.waveformInViewPortObservable.pipe(distinctUntilChanged()).subscribe(() => {
      this.cdr.detectChanges();
    });
    if (this.trackActivated) {
      setTimeout(() => document.addEventListener("click", ($event) => this.markerPopoverClose(), false), 500);
    }
    const breadcrumb = {trackTitle: this.track.title};
    this.ngDynamicBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
  }

  ngAfterContentInit() {
    this.markerPopover.open();
  }

  selectVersion() {
    if (this.player.isPlaying()) this.player.stop();
    this.cdr.detectChanges();
    this.stateService.setActiveVersion(this.version);
    this.stateService.addSelectedVersion(this.track, this.version);
    this.appwaveform.updateVersion();
    this.createNewComment();
    this.project.loadFiles(this.version);
  }

  getVersionIndex(version) {
    return this.track.versions.findIndex(e => e == version);
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
    return this._currentTime;
  }

  getDuration(): number {
    return this.version && this.version.track_length;
  }

  get audioSource(): AudioSource {
    return {
      track: this.track,
      version: this.version,
    };
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
      this.version.files
        .filter(file => file.identifier == 1)
        .map(file => file.aws_path + '.' + file.extension)
        [0]
    );
  }

  showPhoneSearch() {
    this.phonesearch.nativeElement.setAttribute("style", "display:inline-block");
    this.phoneSearchInput.nativeElement.focus();
    this.phonesearch.nativeElement.scrollIntoView();
  }

  clearSearch() {
    this.search = null;
    this.phoneSearchInput.nativeElement.focus();
  }

  hidePhoneSearch(event) {
    if (event.relatedTarget && (event.relatedTarget.getAttribute('id') === "phonesearch")) {
      this.phoneSearchInput.nativeElement.focus(); //in case the search field is cleared or the search icon is clicker: re-focus on the search field.
    }
    else if (this.search == null) {
      this.phonesearch.nativeElement.setAttribute("style", "display:none");
    }
  }

  // Separate function to go back to project overview to clear the browser history entry added when
  overviewByOverviewIconClick() {
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

  getExpiryDateHumanized() {
    if (this.expiry_date) {
      Utils.getDaysDiff(this.expiry_date);
      return Utils.getDateHumanized(this.expiry_date);
    }
    return null;
  }

  getDaysToExpired() {
    if (this.expiry_date) {
      return Utils.getDaysDiff(this.expiry_date);
    }
    return null;
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
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.removeComment(comment);
        this.cdr.detectChanges();
      });
  }

  removeComment(comment: Comment) {
    if (!comment.parent_comment_id) {
      this.version.comments = this.version.comments.filter(
        loadedComment => loadedComment != comment
      );
    }
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

  dragStart() {
    this.comment.include_start = true;
  }

  scrollToTop() {
    this.waveformInViewPort = true;
    this.pauseTitleScroll = true;
    this.trackTitleDOM.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    setTimeout(() => this.pauseTitleScroll = false, 700);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////  SCROLLING OF LONG TITLES ////////////////////////////////////

  scrollInitialWait: number = 1250;
  scrollWaitAtEnd: number = 50;
  overflowTitle: boolean = false;
  scrollFPS = 45;
  pauseTitleScroll: boolean = false;

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
    if (window.innerWidth > 577) {
      document.getElementById("phonesearch").setAttribute("style", "display:none");
    }
  }

  // Detect changes of input variables on the component.
  // Launches auto scrolling when opening a track.
  ngOnChanges(changes) {
    this.waveformInViewPort = true;
    if (this.trackActivated) {
      setTimeout(() => this.autoScroll(), this.scrollInitialWait);
    }
    if (this.markerPopover) {
      setTimeout(() => document.addEventListener("click", ($event) => this.markerPopoverClose(), false), 500);
    }
  }

  isAdminRoute(): boolean {
    return /^\/pro(\/|$)/.test(this.router.url);
  }


  pauseAutoScroll(event) {
    this.pauseTitleScroll = event;
  }

  //Function that does the actual scrolling back and forth of too long titles.
  autoScroll = () => {
    if (this.trackTitleDOM.nativeElement.offsetWidth < this.trackTitleDOM.nativeElement.scrollWidth) { //Only run this function if there is actually a title which overflows the div.
      this.overflowTitle = false;

      this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: none");
      this.trackTitleDOM.nativeElement.removeEventListener("click", this.autoScroll);
      let titleScrollDiv = this.trackTitleDOM.nativeElement.scrollWidth - this.trackTitleDOM.nativeElement.offsetWidth + this.scrollWaitAtEnd;

      let i = 1;
      let scrollLoop = () => {
        setTimeout(() => {
          titleScrollDiv -= 1;
          if (!this.pauseTitleScroll) this.trackTitleDOM.nativeElement.scrollLeft += i;
          if (titleScrollDiv > 0 && this.trackActivated)
            requestAnimationFrame(scrollLoop);
          else if (titleScrollDiv === 0 && i === 1) {
            titleScrollDiv = this.trackTitleDOM.nativeElement.scrollLeft;
            i = -i;
            requestAnimationFrame(scrollLoop);
          }
          else {
            this.trackTitleDOM.nativeElement.setAttribute("style", "text-overflow: ellipsis");
            this.trackTitleDOM.nativeElement.addEventListener("click", this.autoScroll);
            this.overflowTitle = true;
          }
        }, 1000 / this.scrollFPS)
      };
      scrollLoop();
    }
    ;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Catch back button when there is a project with multiple tracks to go back to overview instead of to previous website.
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if (this.enableOverview) {
      this.goToOverview();
    }
    else history.go(2);
  }
}
