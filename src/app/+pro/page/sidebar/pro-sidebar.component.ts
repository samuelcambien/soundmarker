import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StateService} from "../../../services/state.service";
import {ProjectService} from "../../../services/project.service";
import {Track} from "../../../model/track";
import {Player} from "../../../player/player.service";
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
    protected router: Router,
  ) { }

  get toggled(): boolean {
    return this.stateService.sidebarToggled;
  }

  get track(): Track {
    return this.version.track;
  }

  get version(): Version {
    return this.player.version;
  }

  get versionIndex() {
    return this.version.version_index;
  }

  getRouterLink() {
    return 'project/' + this.track.project.project_hash + '/track/' + this.track.track_id;
  }

  setVersionUpload(versionUpload: boolean) {
    this.stateService.setVersionUpload(versionUpload);
  }
}
