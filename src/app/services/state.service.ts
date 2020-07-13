import {Injectable} from '@angular/core';
import {Project} from "../model/project";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {Track} from "../model/track";
import {Comment} from "../model/comment";
import {Version} from '../model/version';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() {
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

  public getActiveVersion(): BehaviorSubject<Version> {
    return this.activeVersion;
  }

  public setActiveVersion(version: Version) {
    this.activeVersion.next(version);
  }

  private activeTrack: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);

  private activeVersion: BehaviorSubject<Version> = new BehaviorSubject<Version>(null);

  public getActiveComment(): BehaviorSubject<Comment> {
    return this.activeComment;
  }

  public setActiveComment(comment: Comment) {
    this.activeComment.next(comment);
  }

  private activeComment: BehaviorSubject<Comment> = new BehaviorSubject<Comment>(null);

  sidebarToggled: boolean;

  private readonly _selectedVersions = new BehaviorSubject<Version[]>([]);

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly selectedVersions$ = this._selectedVersions.asObservable();


  // the getter will return the last value emitted in _todos subject
  private get selectedVersions(): Version[] {
    return this._selectedVersions.getValue();
  }


  // assigning a value to this.todos will push it onto the observable
  // and down to all of its subsribers (ex: this.todos = [])
  private set selectedVersions(val: Version[]) {
    this._selectedVersions.next(val);
  }

  addSelectedVersion(track: Track, version: Version) {
    let version_old = track.versions.filter(activeVersion => {
      return this.selectedVersions.indexOf(activeVersion) > -1
    });
    if (version_old[0]) this.removeVersion(version_old[0].version_id);
    this.selectedVersions.push(version);
  }

  getSelectedVersion(track: Track): Version{
    let version_old = track.versions.filter(activeVersion => {
      return this.selectedVersions.indexOf(activeVersion) > -1
    });
    return version_old[0];
}

  removeVersion(version_id) {
    this.selectedVersions = this.selectedVersions.filter(version => version.version_id !== version_id);
  }
}
