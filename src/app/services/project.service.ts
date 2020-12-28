import {Injectable} from '@angular/core';
import {Project} from "../model/project";
import {interval} from "rxjs";
import {Track} from "../model/track";
import {Version} from "../model/version";
import {Comment} from "../model/comment";
import {Utils} from "../app.component";
import {RestCall} from "../rest/rest-call";
import {StateService} from "./state.service";
import {Player} from "../player/player.service";
import {TrackService} from "./track.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private player: Player,
    private stateService: StateService,
    private trackService: TrackService,
  ) {

    player.progress.subscribe(async e => {
      const comment: Comment = this.stateService.getActiveComment().getValue();
      if (comment && comment.include_end && e.currentTime >= comment.end_time) {
        if (comment.loop == true) {
          await this.player.play(e.audioSource, comment.start_time);
        } else {
          this.player.pause();
          await this.player.seekTo({
            track: this.player.track,
            version: e.audioSource.version,
          }, comment.start_time);
        }
      }
    });

    player.finished.subscribe((version) => {
      if (this.autoPlay) {
        this.playNextTrack(this.getTrack(version));
      }
    });
  }

  async getProject(projectHash: string): Promise<Project> {

    const response = await RestCall.getProject(projectHash);
    const project: Project = Object.assign(new Project(), response, {project_hash: projectHash});

    if (project.project_id) {

      project.tracks.forEach(
        async track => Object.assign(track, await this.trackService.getTrack(track.track_id))
      );

      await Utils.promiseSequential(
        project.tracks.map(track => () => this.loadVersions(track))
      );

      project.losless = response.stream_type != "0";
    }

    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    const projects = (await RestCall.getProjects())["projects"];
    projects.forEach(
      async (project) => Object.assign(project, await this.getProject(project.hash))
    );
    return projects;
  }

  async getRecentProjects(count: number): Promise<Project[]> {
    const allProjects: Project[] = await this.getAllProjects();
    return allProjects
      .sort()
      .slice(0, count);
  }

  async removeProject(project_id) {
    await RestCall.removeProject(project_id);
  }

  getVersion(versionId: string): Version {

    return this.stateService.getActiveProject().getValue().tracks
      .map(track =>
        track.versions.filter(version => version.version_id == versionId)
      ).filter(versions => versions.length > 0)[0][0]
  }

  getTrack(version: any): Track {
    return this.stateService.getActiveProject().getValue().tracks
      .filter(track => track.versions.includes(version))[0];
  }

  async loadProject(projectHash: string): Promise<void> {

    const project: Project = await this.getProject(projectHash);
    this.stateService.setActiveProject(project);
    if (!this.isActive(project) && !this.areCommentsActive(project)) {
      return;
    }
  }

  async loadProjectLI(project): Promise<void> {

    if (project.project_id) {
      this.stateService.setActiveProject(project);

      project.tracks.forEach(track => track.project = project);

      await Utils.promiseSequential(
        project.tracks.map(track => () => this.loadVersions(track))
      );
    }
  }

  async editProject(
    projectId: string,
    title: string,
    downloads: boolean,
    losless: boolean,
    passwordProtected: boolean,
    password?: string
  ): Promise<void> {

    if (passwordProtected && !password) {
      throw new TypeError();
    }

    await RestCall.editProject(projectId, title, losless ? "1" : "0", "0");
  }

  public isActive(project: Project) {
    return !((project.status == "commentsonly") || (project.status == "expired"));
  }

  public getExpiryDate(project: Project) {
    return project.expiration.substr(0, 10);
  }

  public areCommentsActive(project: Project) {
    return project.status == "commentsonly";
  }

  private async loadVersions(track: Track): Promise<void> {

    track.versions = (await RestCall.getTrack(track.track_id))["versions"];

    track.versions.forEach(version => {
      this.loadFiles(version);
      if (version.downloadable == 0) version.downloadable = false
    });
    // const version = track.versions[0];
    // await this.loadFiles(version);
  }

  async loadFiles(version: Version) {
    version.files = (await RestCall.getVersion(version.version_id))["files"];
    this.loadComments(version);
    // interval(20 * 1000)
    //   .subscribe(() => this.loadComments(version))
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
    let tracks = this.stateService.getActiveProject().getValue().tracks;
    let nextTrack = tracks[tracks.indexOf(currentTrack) + 1];
    if (nextTrack) {
      if (this.stateService.getActiveTrack().getValue() != null) {
        this.stateService.setActiveTrack(nextTrack);
      }
      await this.player.play({
        track: nextTrack,
        version: nextTrack.versions[0],
      }, 0);
    }
  }

  public autoPlay: boolean = true;
}
