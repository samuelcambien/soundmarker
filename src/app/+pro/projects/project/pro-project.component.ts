import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from "../../../model/project";
import {StateService} from '../../../services/state.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from '../../../services/project.service';
import {RestCall} from '../../../rest/rest-call';
import {TrackService} from "../../../services/track.service";
import {Track} from "../../../model/track";

@Component({
  selector: 'app-pro-board-projects-project',
  templateUrl: './pro-project.component.html',
  styleUrls: ['./pro-project.component.scss']
})
export class ProProjectComponent implements OnInit {

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: StateService,
    private modalService: NgbModal,
    protected projectService: ProjectService,
    protected trackService: TrackService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.project = await data.project;
      this.cdr.detectChanges();
    });
  }

  openModal(modal) {
    this.modalService.open(modal);
  }

  async removeProject() {
    await this.projectService.removeProject(this.project.project_id);
    RestCall.deleteProject();
    await this.router.navigate(["../pro/projects"]);
  }

  async deleteTrack(track: Track) {
    await this.trackService.delete(track);
    await this.reloadProject();
  }

  async reloadProject() {
    this.project = await this.projectService.getProject(
      this.project.project_hash
    );
  }
}
