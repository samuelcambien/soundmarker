import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Project} from "../../../model/project";
import {RestCall} from "../../../rest/rest-call";

@Injectable()
export class ProjectResolver implements Resolve<Project> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Project> {

    return RestCall.getProject(route.params.project_hash);
  }
}
