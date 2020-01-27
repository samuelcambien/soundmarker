import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Version} from "../../../../model/version";
import {Drawer} from "../../../../player/drawer";
import {DrawerService} from "../../../../services/drawer.service";
import {AudioSource, Player} from "../../../../player/player.service";
import {StateService} from "../../../../services/state.service";

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveformComponent implements OnInit {

  @Input() audioSource: AudioSource;

  @Output() seek = new EventEmitter();

  @ViewChild('waveform') waveform;

  private drawer: Drawer;

  constructor(
    private drawerService: DrawerService,
    private player: Player,
    private stateService: StateService
  ) {
  }

  ngOnInit() {
    this.drawer = new Drawer(
      this.waveform.nativeElement,
      {
        height: 128,
        peaks: JSON.parse(this.audioSource.version.wave_png),
      }
    );
    this.drawer.seek.subscribe(async progress => {
      this.stateService.setActiveComment(null);
      const startTime = progress * this.audioSource.version.track_length;
      if (this.player.isPlaying()) {
        await this.player.play(this.audioSource, startTime);
      } else {
        await this.player.seekTo(this.audioSource, startTime);
      }
    });

    this.drawerService.register(this.audioSource.version, this.drawer);
  }
}
