import {Component} from '@angular/core';
import {StateService} from "../../../services/state.service";
import {ProjectService} from "../../../services/project.service";
import {Track} from "../../../model/track";
import {AudioSource, Player} from "../../../player/player.service";
import {Router} from '@angular/router';
import {Version} from "../../../model/version";

@Component({
  selector: 'app-pro-sidebar',
  templateUrl: './pro-sidebar.component.html',
  styleUrls: ['./pro-sidebar.component.scss']
})
export class ProSidebarComponent {

  constructor(
    protected stateService: StateService,
    protected projectService: ProjectService,
    protected player: Player,
    public router: Router
  ) { }

  get toggled(): boolean {
    return this.stateService.sidebarToggled;
  }

  get audioSource(): AudioSource {
    return this.player.audioSource;
  }

  get track(): Track {
    return this.audioSource.track;
  }

  get version(): Version {
    return this.audioSource.version;
  }

  get versionIndex() {
    return this.track.getVersionIndex(this.version) + 1;
  }

  getRouterLink() {
    return 'project/' + this.track.project.project_hash + '/track/' + this.track.track_id;
  }
}
