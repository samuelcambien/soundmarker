import {Component} from '@angular/core';
import {StateService} from "../../../services/state.service";
import {ProjectService} from "../../../services/project.service";
import {Track} from "../../../model/track";
import {Observable} from "rxjs";

@Component({
  selector: 'app-pro-sidebar',
  templateUrl: './pro-sidebar.component.html',
  styleUrls: ['./pro-sidebar.component.scss']
})
export class ProSidebarComponent {

  constructor(
    private stateService: StateService,
  ) { }

  get toggled(): boolean {
    return this.stateService.sidebarToggled;
  }

  get activeTrack(): Observable<Track> {
    return this.stateService.getActiveTrack()
  }
}
