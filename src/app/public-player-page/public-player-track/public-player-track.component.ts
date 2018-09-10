import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../../newplayer/track";

@Component({
  selector: 'app-public-player-track',
  templateUrl: './public-player-track.component.html',
  styleUrls: ['./public-player-track.component.scss']
})
export class PublicPlayerTrackComponent implements OnInit {

  @Input() track: Track;

  constructor() { }

  ngOnInit() {
  }

}
