import {Component, OnInit} from '@angular/core';
import {Project} from "../../model/project";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-pro-board-projects',
  templateUrl: './pro-board-projects.component.html',
  styleUrls: ['./pro-board-projects.component.scss']
})
export class ProBoardProjectsComponent implements OnInit {

  constructor(
    protected projectService: ProjectService,
  ) {

  }

  user_project_list: Project[];

  async ngOnInit() {
    this.user_project_list = await this.projectService.getAllProjects();
  }
}
