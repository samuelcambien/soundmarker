import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Track} from "../../../model/track";
import {Project} from "../../../model/project";
import {StateService} from '../../../services/state.service';
import {ProjectService} from '../../../services/project.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrackService} from "../../../services/track.service";
import {BreadcrumbService} from 'xng-breadcrumb';

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
    private modalService: NgbModal,
    private router: Router,
    private trackService: TrackService,
    private breadcrumbService: BreadcrumbService
  ) {

  }

  ngOnInit(): void {
    if (!this.inputTrack) {
      this.route.data.subscribe(async data => {
        this.project = await data.project;
        this.project.project_hash = this.route.snapshot.params.project_hash;
        this.track = this.project.tracks.find(track => track.track_id == this.route.snapshot.params.id);
        this.breadcrumbService.set('/track/:id/newversion' , 'New version upload');
        this.breadcrumbService.set('/track/:id', this.track.title);
        this.breadcrumbService.set('/projects/:project_hash', this.project.title);
        this.track.project = this.project;
        this.track.track_id = this.route.snapshot.params.id;
        this.stateService.setActiveTrack(this.track);
      });
    }
    else {
      this.track = this.inputTrack;
      this.project = this.stateService.getActiveProject().getValue();
    }
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
