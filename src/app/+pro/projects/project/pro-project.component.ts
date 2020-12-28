import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from "../../../model/project";
import {Track} from '../../../model/track';
import {StateService} from '../../../services/state.service';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from '../../../services/project.service';
import {RestCall} from '../../../rest/rest-call';

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
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
    private modalService: NgbModal,
    protected projectService: ProjectService
  ) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.project = await data.project;
      const breadcrumb =  {projectTitle: this.project.title};
      this.ngDynamicBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    });

  }

  openModal(modal) {
    this.modalService.open(modal);
  }

  removeProject(){
    this.projectService.removeProject(this.project.project_id).then(()=> {
     RestCall.deleteProject();
      this.router.navigate(["../pro/projects"]);
      }
    )
  }
}
