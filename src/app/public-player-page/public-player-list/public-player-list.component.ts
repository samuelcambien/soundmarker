import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../../newplayer/track";

@Component({
  selector: 'app-public-player-list',
  templateUrl: './public-player-list.component.html',
  styleUrls: ['./public-player-list.component.scss']
})
export class PublicPlayerListComponent implements OnInit {

  @Input() tracks: Track[];

  constructor() { }

  ngOnInit() {
  }

}
