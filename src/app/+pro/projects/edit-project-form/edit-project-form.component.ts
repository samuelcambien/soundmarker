import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from "../../../model/project";
import {Uploader} from "../../../services/uploader.service";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector: 'app-edit-project-form',
  templateUrl: './edit-project-form.component.html',
  styleUrls: ['./edit-project-form.component.scss']
})
export class EditProjectFormComponent implements OnInit {

  @Input() project: Project;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  title: string;

  downloads: boolean;
  losless: boolean;
  passwordProtected: boolean;
  password: string;

  constructor(
    protected projectService: ProjectService,
  ) {
  }

  ngOnInit() {
    this.title = this.project.title;
    this.downloads = this.project.downloads;
    this.losless = this.project.losless;
    this.passwordProtected = false;
  }

  async onSubmit() {
    await this.projectService.editProject(
      this.project.project_id,
      this.title,
      this.downloads,
      this.losless,
      this.passwordProtected,
      this.password,
    );
    this.save.emit();
  }
}
