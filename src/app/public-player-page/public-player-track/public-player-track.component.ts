import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../model/track";
import {Player} from "../../newplayer/player";
import {saveAs} from 'file-saver/FileSaver';
import {animate, transition, trigger} from "@angular/animations";
import {Version} from "../../model/version";
import {Utils} from "../../app.component";
import {PlayerService} from "../../player.service";

@Component({
  selector: 'app-public-player-track',
  templateUrl: './public-player-track.component.html',
  styleUrls: ['./public-player-track.component.scss'],
  animations: [
    trigger('toggleComments', [
      transition('* => *', animate('5000s'))
    ])
  ]
})
export class PublicPlayerTrackComponent implements OnInit {

  @Input() track: Track;
  @Input() player;
  @Output() selected = new EventEmitter<Track>();
  @Output() playing = new EventEmitter();

  version: Version;

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    this.track.versions.then(versions => this.version = versions[0]);
  }

  play() {
    this.playing.emit();
    this.playerService.getPlayer(this.track.track_id).play();
  }

  trackSelected() {
    this.selected.emit(this.track);
  }

  download() {
    // Utils.sendGetDataRequest(this.track.track_url + ".mp3", [], "", (response, trackRequest) => {
    //   saveAs(new Blob(
    //     [
    //       trackRequest.responseText
    //     ],
    //     {
    //       type: trackRequest.getResponseHeader("content-type")
    //     }), this.track.title + ".mp3"
    //   )
    // });
  }
}
