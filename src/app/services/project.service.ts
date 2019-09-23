import {Injectable} from '@angular/core';
import {Project} from "../model/project";
import {interval} from "rxjs";
import {Track} from "../model/track";
import {Version} from "../model/version";
import {Comment} from "../model/comment";
import {Utils} from "../app.component";
import {Player} from "../player.service";
import {RestCall} from "../rest/rest-call";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private player: Player,
    private stateService: StateService,
  ) {

    player.finished.subscribe((version) => {
      if (this.autoPlay) {
        this.playNextTrack(this.getTrack(version));
      }
    });
  }

  getVersion(versionId: string): Version {

    return this.stateService.getActiveProject().tracks
      .map(track =>
        track.versions.filter(version => version.version_id == versionId)
      ).filter(versions => versions.length > 0)[0][0]
  }

  getTrack(version: any): Track {
    return this.stateService.getActiveProject().tracks
      .filter(track => track.versions.includes(version))[0];
  }

  async loadProject(projectHash: string): Promise<void> {

    const project = await RestCall.getProject(projectHash);
    this.stateService.setActiveProject(project);

    if (!this.isActive(project) && !this.areCommentsActive(project)) {
      return Promise.resolve();
    }

    return Utils.promiseSequential(
      project.tracks.map(track => () => this.loadVersions(track))
    );
  }

  public isActive(project: Project) {
    return project.status == "active";
  }

  public getExpiryDate(project: Project) {
    return project.expiration.substr(0, 10);
  }

  public areCommentsActive(project: Project) {
    return project.status != "expired";
  }

  private async loadVersions(track: Track): Promise<void> {
    track.versions = (await RestCall.getTrack(track.track_id)
  )
    ["versions"];

    track.versions.forEach(version => {
      if (version.downloadable == 0) version.downloadable = false
    });

    const version = track.versions[0];
    await this.loadFiles(version);
  }

  private async loadFiles(version: Version) {
    version.files = (await RestCall.getVersion(version.version_id))["files"];
    this.loadComments(version);
    interval(20 * 1000)
      .subscribe(() => this.loadComments(version))
  }

  private async loadComments(version: Version): Promise<void> {
    let allComments: Comment[] = (await RestCall.getComments(version.version_id))["comments"];
    version.comments = (version.comments || [])
      .concat(
        allComments
          .filter(comment => comment.parent_comment_id == 0)
          .filter(comment =>
            !(version.comments || [])
              .map(loadedComment => loadedComment.comment_id)
              .includes(comment.comment_id)
          )
      );
    for (let comment of version.comments) {
      if (comment.include_end == 0) comment.include_end = false;
      if (comment.include_start == 0) comment.include_start = false;
      comment.version_id = version.version_id;
      this.loadReplies(comment, allComments);
    }
  }

  private loadReplies(comment: Comment, allComments: Comment[]) {
    comment.replies = (comment.replies || []).concat(allComments.filter(reply => reply.parent_comment_id == comment.comment_id)
      .filter(reply =>
        !(comment.replies || [])
          .map(loadedReply => loadedReply.comment_id)
          .includes(reply.comment_id)
      ));
  }

  async playNextTrack(currentTrack: Track) {

    let tracks = this.stateService.getActiveProject().tracks;
    let nextTrack = tracks[tracks.indexOf(currentTrack) + 1];
    if (nextTrack) {
      await this.player.playFromStart(nextTrack.versions[0]);
      if (this.stateService.getActiveTrack().getValue() != null) {
        this.stateService.setActiveTrack(nextTrack);
      }
    }
  }

  public autoPlay: boolean = true;
}
