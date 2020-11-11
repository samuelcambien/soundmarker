import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../model/project";
import {Track} from '../../../model/track';
import {StateService} from '../../../services/state.service';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';

@Component({
  selector: 'app-pro-board-projects-project',
  templateUrl: './pro-project.component.html',
  styleUrls: ['./pro-project.component.scss']
})
export class ProProjectComponent implements OnInit {

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private stateService: StateService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService
  ) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      console.log(data);
      this.project = await data.project;
      const breadcrumb =  {projectTitle: this.project.title};
      this.ngDynamicBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    });

  }
}
