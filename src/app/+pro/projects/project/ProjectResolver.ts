import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../services/project.service";

@Injectable()
export class ProjectResolver implements Resolve<Project> {

  constructor(
    protected projectService: ProjectService,
  ) {

  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Project> {
    return this.projectService.getProject(route.params.project_hash);
  }
}
