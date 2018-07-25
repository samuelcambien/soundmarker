import {Component, OnInit} from '@angular/core';
import * as WaveSurfer from 'wavesurfer';
import {ActivatedRoute} from "@angular/router";
import {Comment, CommentSorter} from "../comment";
import {RestUrl, Utils} from "../app.component";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  trackId: string;
  trackTitle: string;
  versionId: string;

  comments: Comment[];

  public commentSorters: CommentSorter[] = [
    CommentSorter.MOST_RECENT_FIRST,
    CommentSorter.MOST_RECENT_LAST,
    CommentSorter.NAME_A_Z,
    CommentSorter.NAME_Z_A
  ];

  private currentSorter: CommentSorter = CommentSorter.MOST_RECENT_FIRST;

  constructor(private route: ActivatedRoute) {
  }

  private wavesurfer: any;

  ngOnInit() {

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });

    this.route.params.subscribe(params => {
      this.trackId = params['track_id'];
    });

    this.loadTrackInfo();
  }

  private loadTrackInfo() {
    Utils.sendGetRequest(RestUrl.TRACK, [this.trackId], (response) => {

      this.trackTitle = response['track_title'];
      this.versionId = response['version_id'];

      this.wavesurfer.load(RestUrl.VERSION);
      this.loadComments();
    });
  }

  private loadComments() {
    Utils.sendGetRequest(RestUrl.COMMENTS, [this.versionId], (response) => {
      this.comments = response;
      this.loadReplies();
    });
  }

  private loadReplies() {
    for (let comment of this.comments) {
      Utils.sendGetRequest(RestUrl.REPLIES, [comment.id], (response) => {
        comment.replies = response;
      });
    }
  }

  play() {
    this.wavesurfer.play();
  }

  pause() {
    this.wavesurfer.pause();
  }

  isPlaying() {
    return this.wavesurfer.isPlaying();
  }

  getCommentsSorted() {
    return this.comments ? this.comments.sort(this.currentSorter.comparator) : [];
  }
}
