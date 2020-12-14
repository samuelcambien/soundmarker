import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AudioSource, Player} from "../player.service";
import {Version} from "../../model/version";

@Component({
  selector: 'play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss']
})
export class PlayButtonComponent {

  @Input() inverse: boolean = false;
  @Input() disabled: boolean;
  @Input() audioSource: AudioSource;

  get version(): Version {
    return !this.audioSource ?
      undefined :
      this.audioSource.version;
  }

  get state(): State {
    if (!this.version) {
      return State.none;
    }
    if (this.player.isLoading(this.version)) {
      return State.loading;
    }
    if (this.player.isPlaying()) {
      return State.pause;
    }
    return State.play;
  }

  constructor(
    protected player: Player,
  ) {
  }

  async click() {
    switch (this.state) {
      case State.play:
        await this.player.play(this.audioSource);
        break;
      case State.pause:
        this.player.pause();
        break;
    }
  }

  defaultPrimaryColour = '#7397FF';
  defaultSecondaryColour = '#FFFFFF';

  get primaryColour() {
    return this.inverse ? this.defaultSecondaryColour : this.defaultPrimaryColour;
  }

  get secondaryColour() {
    return this.inverse ? this.defaultPrimaryColour : this.defaultSecondaryColour;
  }
}

export enum State {
  none = "none",
  loading = "loading",
  play = "play",
  pause = "pause",
  stop = "stop"
}
