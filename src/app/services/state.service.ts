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

  ///////////////////// PROJECT /////////////////////////////////////////////////////////////
  private activeProject: BehaviorSubject<Project> = new BehaviorSubject<Project>((null));
  public getActiveProject(): BehaviorSubject<Project> {
    return this.activeProject;
  }
  public setActiveProject(project: Project) {
    this.activeProject.next(project);
  }

  ///////////////////// TRACK ///////////////////////////////////////////////////////////
  private activeTrack: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);
  public getActiveTrack(): BehaviorSubject<Track> {
    return this.activeTrack;
  }
  public setActiveTrack(track: Track) {
    this.activeTrack.next(track);
  }

  ///////////////////// VERSION /////////////////////////////////////////////////////////////
  private activeVersion: BehaviorSubject<Version> = new BehaviorSubject<Version>(null);
  public getActiveVersion(): BehaviorSubject<Version> {
    return this.activeVersion;
  }
  public setActiveVersion(version: Version) {
    this.activeVersion.next(version);
  }

  ///////////////////// SELECTED VERSIONS AT UPLOAD ///////////////////////////////////////////
  private readonly _selectedVersions = new BehaviorSubject<Version[]>([]);

  readonly selectedVersions$ = this._selectedVersions.asObservable();

  private get selectedVersions(): Version[] {
    return this._selectedVersions.getValue();
  }

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

  ///////////////////// COMMENT /////////////////////////////////////////////////////////////
  private activeComment: BehaviorSubject<Comment> = new BehaviorSubject<Comment>(null);
  public getActiveComment(): BehaviorSubject<Comment> {
    return this.activeComment;
  }
  public setActiveComment(comment: Comment) {
    this.activeComment.next(comment);
  }

  sidebarToggled: boolean;

  playerToggled: boolean;

  private versionUpload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getVersionUpload(): BehaviorSubject<boolean> {
    return this.versionUpload;
  }
  public setVersionUpload(versionUpload: boolean) {
    this.versionUpload.next(versionUpload);
  }
}
