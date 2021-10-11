import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {DrawerService} from "../../../../services/drawer.service";
import {Player} from '../../../../player/player.service';
import {Drawer} from "../../../../player/drawer";
import {StateService} from "../../../../services/state.service";
import {RestCall} from "../../../../rest/rest-call";
import {Version} from "../../../../model/version";

@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveformComponent {

  @Output() seek = new EventEmitter();

  @ViewChild('waveform', {static: true}) waveform;

  private drawer: Drawer;

  constructor(
    private drawerService: DrawerService,
    private player: Player,
    private stateService: StateService,
    private cdr: ChangeDetectorRef
  ) {
  }

  async drawWaveform(version: Version) {
    this.waveform.nativeElement.innerHTML = "";
    const waveform = await RestCall.getWaveform(version.version_id);
    this.drawer = new Drawer(
      this.waveform.nativeElement,
      {
        height: 128,
        peaks: JSON.parse(waveform),
      }
    );
    this.drawer.seek.subscribe(async progress => {
      this.stateService.setActiveComment(null);
      const startTime = progress * version.track_length;
      if (this.player.isPlaying(version)) {
        await this.player.play(version, startTime);
      } else {
        await this.player.seekTo(version, startTime);
      }
    });
    this.drawerService.register(version, this.drawer);
  }
}
