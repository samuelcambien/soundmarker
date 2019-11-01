import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Version} from "../../../model/version";
import {DrawerService} from "../../../services/drawer.service";
import {Player} from "../../../player.service";
import {Drawer} from "../../../drawer";
import {StateService} from "../../../services/state.service";

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveformComponent implements OnInit {

  @Input() version: Version;

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
        peaks: JSON.parse(this.version.wave_png),
      }
    );
    this.drawer.seek.subscribe(async progress => {
      this.stateService.setActiveComment(null);
      const startTime = progress * this.version.track_length;
      if (this.player.isPlaying()) {
        await this.player.play(this.version, startTime);
      } else {
        await this.player.seekTo(this.version, startTime);
      }
    });

    this.drawerService.register(this.version, this.drawer);
  }
}
