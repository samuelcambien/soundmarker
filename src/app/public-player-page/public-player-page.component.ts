import {Component, OnInit} from '@angular/core';
import * as WaveSurfer from 'wavesurfer';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../comment";
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

    Utils.sendGetRequest(RestUrl.TRACK, (response) => {
      this.trackTitle = response['track_title'];
      this.versionId = response['version_id'];
    });

    Utils.sendGetRequest(RestUrl.COMMENTS, (response) => this.comments = response);

    this.wavesurfer.load(RestUrl.VERSION);
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
}
