import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Project} from "../../../model/project";
import {RestCall} from "../../../rest/rest-call";
import {ProjectService} from "../../../services/project.service";

@Injectable()
export class ProjectResolver implements Resolve<Project> {

  constructor(
    protected projectService: ProjectService,
  ) {

  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Project> {
    const project: Project = await RestCall.getProject(route.params.project_hash);
    await this.projectService.loadProjectLI(project);
    return project;
  }
}
