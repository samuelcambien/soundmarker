import {Injectable} from '@angular/core';
import {Project} from "../model/project";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {Track} from "../model/track";
import {Comment} from "../model/comment";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
  ) {
  }

  public getActiveProject(): Project {
    return this.activeProject;
  }

  public setActiveProject(project: Project) {
    this.activeProject = project;
  }

  private activeProject: Project;

  public getActiveTrack(): BehaviorSubject<Track> {
    return this.activeTrack;
  }

  public setActiveTrack(track: Track) {
    this.activeTrack.next(track);
  }

  private activeTrack: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);

  public getActiveComment(): BehaviorSubject<Comment> {
    return this.activeComment;
  }

  public setActiveComment(comment: Comment) {
    this.activeComment.next(comment);
  }

  private activeComment: BehaviorSubject<Comment> = new BehaviorSubject<Comment>(null);
}
