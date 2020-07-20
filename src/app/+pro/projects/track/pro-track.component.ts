import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Track} from "../../../model/track";
import {Project} from "../../../model/project";
import {RestCall} from "../../../rest/rest-call";
import {AudioSource} from "../../../player/player.service";
import {StateService} from '../../../services/state.service';
import {ProjectService} from '../../../services/project.service';

@Component({
  selector: 'app-pro-board-projects-track',
  templateUrl: './pro-track.component.html',
  styleUrls: ['./pro-track.component.scss']
})
export class ProTrackComponent implements OnInit {

  private project: Project;
  private track: Track;

  constructor(
    private route: ActivatedRoute,
    private stateService: StateService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.project = await data.project;
      this.track = await data.track
      this.track.track_id = this.route.snapshot.params.id
      await this.projectService.loadProjectLI(this.project);
    });
  }

  get audioSource(): AudioSource {
    return {
      track: this.track,
      version: this.track.versions[0],
    };
  }
}
