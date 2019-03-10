import {Injectable} from '@angular/core';
import {Project} from "../model/project";
import {AsyncSubject, BehaviorSubject, Observable, of, Subject} from "rxjs";
import {tap, withLatestFrom} from "rxjs/operators";
import {Track} from "../model/track";
import {PlayerService} from "./player.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private playerService: PlayerService) {
  }

  public getActiveProject(): Project {
    return this.activeProject;
  }

  public setActiveProject(project: Project) {
    this.activeProject = project;
  }

  private activeProject: Project;

  public getActiveTrack(): Track {
    return this.activeTrack;
  }

  public setActiveTrack(track: Track) {
    this.activeTrack = track;
    if (track) setTimeout(() => {
        if (this.playerService.getPlayer(track.track_id))
          this.playerService.getPlayer(track.track_id).redraw();
      }, 4
    );
  }

  private activeTrack: Track;

  playNextTrack(track) {
    let tracks = this.getActiveProject().tracks;
    let nextTrack = tracks[tracks.indexOf(track) + 1];
    if (nextTrack) {
      this.playerService.getPlayer(track.track_id).unloadAudio();
      this.playerService.getPlayer(nextTrack.track_id).play();
      if (this.activeTrack != null) {
        this.setActiveTrack(nextTrack);
      }
    }
  }

  public autoPlay: boolean = true;
}
