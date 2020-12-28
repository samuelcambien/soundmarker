import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
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
    protected modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
  }

  user_project_list: Project[];

  async ngOnInit() {
    this.user_project_list = await this.projectService.getAllProjects();
  }

  openModal(modal) {
    this.modalService.open(modal);
  }

  async reloadProject(index: number) {
    this.user_project_list[index] = await this.projectService.getProject(
      this.user_project_list[index].project_hash
    );
  }

  removeProject(project: Project, index: number){
    this.projectService.removeProject(project.project_id).then(()=> {
        this.user_project_list.splice(index, 1);
        this.cdr.detectChanges();
      }
    )
  }
}
