import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Track} from "../../../model/track";
import {RestCall} from "../../../rest/rest-call";
import {TrackService} from "../../../services/track.service";

@Injectable()
export class TrackResolver implements Resolve<Track> {

  constructor(
    protected trackService: TrackService,
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Track> {
    return this.trackService.getTrack(route.params.id);
  }
}
