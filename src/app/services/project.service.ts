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
          await this.player.play(e.version, comment.start_time);
        } else {
          this.player.pause();
          await this.player.seekTo(e.version, comment.start_time);
        }
      }
    });

    player.finished.subscribe((version) => {
      if (this.autoPlay) {
        this.playNextTrack(version.track);
      }
    });
  }

  async getProject(projectHash: string): Promise<Project> {
    const response = await RestCall.getProject(projectHash);
    const project: Project = Object.assign(new Project(), response, {project_hash: projectHash});
    this.stateService.setActiveProject(project);

    if (project.project_id) {
      project.tracks = await Promise.all(
        project.tracks.map(async track => await this.trackService.getTrack(track.track_id))
      );
      project.lossless = response.stream_type != "0";
    }
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    const projects = (await RestCall.getProjects())["projects"];
    await projects.forEach(
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

  async loadProject(projectHash: string): Promise<void> {

    const project: Project = await this.getProject(projectHash);
    if (!this.isActive(project) && !this.areCommentsActive(project)) {
      return;
    }
  }

  async loadProjectLI(project): Promise<void> {

    if (project.project_id) {

      project.tracks.forEach(track => track.project = project);
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

    await RestCall.editProject(projectId, title, losless ? "1" : "0", passwordProtected, password);
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

  async playNextTrack(currentTrack: Track) {
    let tracks = this.stateService.getActiveProject().getValue().tracks;
    let nextTrack = tracks[tracks.indexOf(currentTrack) + 1];
    if (!!nextTrack) {
      if (this.stateService.getActiveTrack().getValue() != null) {
        this.stateService.setActiveTrack(nextTrack);
      }
      await this.player.play(nextTrack.versions[0], 0);
    }
  }

  public autoPlay: boolean = true;
}
