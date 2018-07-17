import {Component, OnInit} from '@angular/core';
import * as WaveSurfer from 'wavesurfer';

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  constructor() {
  }

  private wavesurfer: any;

  ngOnInit() {

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });
    this.wavesurfer.load('http://9774e4f5.ngrok.io/rest/stream/file');
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
