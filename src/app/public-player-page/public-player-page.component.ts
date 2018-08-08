import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment, CommentSorter} from "../comment";
import {RestUrl, Utils} from "../app.component";
import Player from "src/app/player/dist/player";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  showComments: boolean = false;

  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  trackId: string;
  trackTitle: string;
  versionId: string;

  comments: Comment[];

  comment: Comment = new Comment();

  player;

  public commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT_FIRST,
    CommentSorter.MOST_RECENT_LAST,
    CommentSorter.NAME_A_Z,
    CommentSorter.NAME_Z_A
  ];

  private currentSorter: CommentSorter = CommentSorter.MOST_RECENT_FIRST;

  constructor(private route: ActivatedRoute) {
  }

  private timeline: any;

  private duration: any;

  private playerWidth;
  private trackUrl: string;

  ngOnInit() {

    let player = this.player = Player.create({
      container: '#waveform',
      timebar: '#timebar',
      waveColor: 'grey',
      progressColor: 'orange'
    });

    let my = this;

    player.on('ready', function () {
      my.timeline = Object.create(Player.Timeline);

      let timeline = my.timeline;

      timeline.init({
        player: player,
        container: "#timebar",
        height: 10
      });

      my.duration = my.getDuration();


      let bbox = timeline.player.drawer.wrapper.getBoundingClientRect();
      my.playerWidth = bbox.width;

      console.log(my.playerWidth);
      // my.playerWidth = my.getPlayerWidth();
    });

    this.route.params.subscribe(params => {
      this.trackId = params['track_id'];
      this.loadTrackInfo();
    });
  }

  private getDuration() {
    return this.player.backend.getDuration();
  }

  private getPlayerWidth() {
    let bbox = this.timeline.player.drawer.wrapper.getBoundingClientRect();
    this.playerWidth = bbox.width;
  }

  private loadTrackInfo() {
    Utils.sendGetRequest(RestUrl.TRACK, [this.trackId], '"emailAddress":"george.washington@america.com"', (response) => {

      this.trackTitle = response['track_title'];
      this.versionId = response['version_id'];

      this.trackUrl = response['track_url'];

      this.player.loadBuffer(RestUrl.VERSION);
      this.loadComments();
    });
  }

  private loadComments() {
    Utils.sendGetRequest(RestUrl.COMMENTS, [this.versionId], "", (response) => {
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

  updateStartTime(event) {
    this.comment.includeStart = true;
    this.comment.start = this.getCommentTime(this.startTime, event);
  }

  updateEndTime(event) {
    this.comment.includeEnd = true;
    this.comment.end = this.getCommentTime(this.endTime, event);
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  isPlaying() {
    return this.player.isPlaying();
  }

  getCommentsSorted() {
    return this.comments ? this.comments.sort(this.currentSorter.comparator) : [];
  }

  validateDragStart() {
    return (coords) =>
      this.getCommentTime(this.startTime, coords) > 0 &&
      (this.getCommentTime(this.startTime, coords) < this.comment.end || !this.comment.includeEnd) &&
      this.getCommentTime(this.startTime, coords) <= this.duration;
  }

  validateDragEnd() {
    return (coords) =>
      this.getCommentTime(this.endTime, coords) > 0 &&
      this.getCommentTime(this.endTime, coords) > this.comment.start &&
      this.getCommentTime(this.endTime, coords) <= this.duration;
  }

  private getPosition(element, commentTime) {
    return this.playerWidth && this.duration ?
      this.playerWidth * commentTime / this.duration - element.nativeElement.offsetWidth / 2 + "px" :
      -element.nativeElement.offsetWidth / 2 + "px";
  }

  private getCommentTime(element, event) {

    return this.duration * (element.nativeElement.offsetLeft + event.x + element.nativeElement.offsetWidth / 2) / this.playerWidth;
  }

  private getCommentTimeFromCoords(element, coords) {
    return (coords.x - element.nativeElement.offsetLeft / 2) * this.duration / this.playerWidth;
  }
}
