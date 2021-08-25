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
export class ProSidebarComponent implements OnInit{

  constructor(
    protected stateService: StateService,
    protected projectService: ProjectService,
    protected player: Player,
    protected router: Router,
  ) { }

  trackRoute ;

  ngOnInit(){
    this.stateService.getSidebarPlayer().subscribe((playerRoute)=> this.trackRoute = playerRoute)
  }

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
    return this.version.version_number;
  }

  getRouterLink() {
    // console.log(this);
    return this.trackRoute
  }
}
