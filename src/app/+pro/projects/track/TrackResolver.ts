import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Track} from "../../../model/track";
import {RestCall} from "../../../rest/rest-call";

@Injectable()
export class TrackResolver implements Resolve<Track> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Track> {
    return RestCall.getTrack(route.params.id);
  }
}
