import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Track} from "../../model/track";
import {saveAs} from 'file-saver/FileSaver';
import {animate, transition, trigger} from "@angular/animations";
import {Version} from "../../model/version";
import {PlayerService} from "../../services/player.service";
import {File} from "../../model/file";

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
  @Input() expired: boolean;
  @Output() selected = new EventEmitter<Track>();

  version: Version;
  private files: File[];

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    this.track.versions.then(versions => {
      this.version = versions[0];
      this.version.files.then(files => this.files = files);
    });
  }

  play() {
    this.getPlayer().play();
  }

  isPlaying() {
    return this.getPlayer() && this.getPlayer().isPlaying();
  }

  private getPlayer() {
    return this.playerService.getPlayer(this.track.track_id);
  }

  trackSelected() {
    this.selected.emit(this.track);
  }

  download() {

    window.open(
      this.files
        .filter(file => file.identifier == 1)
        .map(file => file.aws_path + '.' + file.extension)
        [0]
    );
  }

  playerIsReady(): boolean {
    return this.playerService.playerReady(this.track.track_id);
  }
}
