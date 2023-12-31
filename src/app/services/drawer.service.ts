import {ApplicationRef, Injectable} from '@angular/core';
import {Version} from "../model/version";
import {ProjectService} from "./project.service";
import {StateService} from "./state.service";
import {Drawer} from "../player/drawer";
import {Player} from "../player/player.service";

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  constructor(
    private player: Player,
    private ref: ApplicationRef,
    private projectService: ProjectService,
    private stateService: StateService
  ) {

    player.progress.subscribe((e) => {
      if (!!e.version) {
        const drawer = this.getDrawer(e.version.version_id);
        if (!!drawer) {
          drawer.progress(e.currentTime / e.version.track_length);
        }
      }
    });

    this.stateService.getActiveTrack().subscribe(track => {
      // if(!this.expired) {
        if (track) setTimeout(() => {
            this.ref.tick();
            this.redraw();
          }, 4
        );
      // }
    });

    this.stateService.getActiveComment().subscribe(
      comment => {
        if (comment && comment.include_end) {
          let version = this.projectService.getVersion(comment.version_id);
          this.getDrawer(comment.version_id).highlight(comment.start_time / version.track_length, comment.end_time / version.track_length);
        } else
          this.drawers.forEach(drawer => drawer.highlight(0, 0));
      }
    );
  }

  private drawers: Map<string, Drawer> = new Map();

  redraw(versionId?: string) {
    if (versionId)
      this.getDrawer(versionId).drawBuffer();
    else
      this.drawers.forEach(drawer => drawer.drawBuffer());
  }

  getDrawer(versionId: string): Drawer {
    return this.drawers.get(versionId);
  }

  register(version: Version, drawer: Drawer) {
    this.drawers.set(version.version_id, drawer);
  }
}
