import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Track} from "../../../model/track";
import {Project} from "../../../model/project";
import {AudioSource} from "../../../player/player.service";
import {StateService} from '../../../services/state.service';
import {ProjectService} from '../../../services/project.service';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrackService} from "../../../services/track.service";
import {Message} from "../../../message";

@Component({
  selector: 'app-pro-board-projects-track',
  templateUrl: './pro-track.component.html',
  styleUrls: ['./pro-track.component.scss']
})
export class ProTrackComponent implements OnInit {

  project: Project;
  track: Track;
  @Input("inputTrack") inputTrack;

  constructor(
    private route: ActivatedRoute,
    private stateService: StateService,
    private projectService: ProjectService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
    private modalService: NgbModal,
    private router: Router,
    private trackService: TrackService,
  ) {

  }

  ngOnInit(): void {
    if (!this.inputTrack) {
      this.route.data.subscribe(async data => {
        this.project = await data.project;
        this.project.project_hash = this.route.snapshot.params.project_hash;
        this.track = await data.track;
        this.track.project = this.project;
        this.track.track_id = this.route.snapshot.params.id;
        this.stateService.setActiveTrack(this.track);
        await this.projectService.loadProjectLI(this.project);
        const breadcrumb = {projectTitle: this.project.title};
        this.ngDynamicBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    }
    else {
      this.track = this.inputTrack;
      this.project = this.stateService.getActiveProject().getValue();
      const breadcrumb = {projectTitle: this.project.title};
      this.ngDynamicBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    }
  }

  get audioSource(): AudioSource {
    return {
      track: this.track,
      version: this.track.versions[0],
    };
  }

  openModal(modal) {
    this.modalService.open(modal);
  }

  async reloadTrack() {
    this.track = await this.trackService.getTrack(this.track.track_id);
  }

  async deleteTrack() {
    await this.trackService.delete(this.track);
    await this.router.navigate([`../pro/projects/${this.project.project_id}`]);
  }
}
