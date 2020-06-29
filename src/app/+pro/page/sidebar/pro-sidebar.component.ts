import {Component} from '@angular/core';
import {StateService} from "../../../services/state.service";
import {ProjectService} from "../../../services/project.service";
import {Track} from "../../../model/track";
import {Observable} from "rxjs";
import {Player} from "../../../player/player.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-pro-sidebar',
  templateUrl: './pro-sidebar.component.html',
  styleUrls: ['./pro-sidebar.component.scss']
})
export class ProSidebarComponent {

  constructor(
    protected stateService: StateService,
    protected player: Player,
    public router: Router
  ) { }

  get toggled(): boolean {
    return this.stateService.sidebarToggled;
  }

  get activeTrack(): Track {
    return this.player.track;
  }

  play() {
    this.player.play();
  }

  navigateTo(url){
    this.router.navigate(url);
  }
}
