import {ApplicationRef, ChangeDetectorRef, Injectable} from '@angular/core';
import {Project} from "../model/project";
import {AsyncSubject, BehaviorSubject, interval, Observable, of, ReplaySubject, Subject} from "rxjs";
import {tap, withLatestFrom} from "rxjs/operators";
import {Track} from "../model/track";
import {PlayerService} from "./player.service";
import {RestCall} from "../rest/rest-call";
import {Version} from "../model/version";
import {Comment} from "../model/comment";
import {Utils} from "../app.component";
import {Player} from "../player";
import {File} from "../model/file";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private playerService: PlayerService, private ref: ApplicationRef) {
  }

  public loadProject(projectHash: string): Promise<void> {

    return RestCall.getProject(projectHash)
      .then((project: Project) => {
        this.setActiveProject(project);

        if (!this.isActive(project)) {
          return Promise.resolve();
        }

        return Utils.promiseSequential(
          project.tracks.map(track => () => this.loadVersions(track))
        );
      });
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

  private loadVersions(track: Track): Promise<void> {
    return RestCall.getTrack(track.track_id)
      .then(response => {
        track.versions = response["versions"];

        track.versions.forEach(version => {
          if (version.downloadable == 0) version.downloadable = false
        });

        const version = track.versions[0];
        return this.loadFiles(version)
          .then(() => this.loadPlayer(track, version))
      });
  }

  private loadFiles(version: Version): Promise<void> {
    return RestCall.getVersion(version.version_id)
      .then(response => {
        version.files = response["files"];
        this.loadComments(version);
        interval(20 * 1000)
          .subscribe(() => this.loadComments(version))
      });
  }

  private loadComments(version: Version): Promise<void> {
    return RestCall.getComments(version.version_id)
      .then(response => {
        let allComments: Comment[] = response["comments"];
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
      })
  }

  private loadReplies(comment: Comment, allComments: Comment[]) {
    comment.replies = (comment.replies || []).concat(allComments.filter(reply => reply.parent_comment_id == comment.comment_id)
      .filter(reply =>
        !(comment.replies || [])
          .map(loadedReply => loadedReply.comment_id)
          .includes(reply.comment_id)
      ));
  }

  private getStreamFile(version: Version): File {
    return version.files.filter(file => file.identifier == 0)[0];
  }

  public loadPlayer(track: Track, version: Version) {

    const streamFile = this.getStreamFile(version);
    const player = new Player(
      JSON.parse(version.wave_png),
      track.title,
      streamFile.aws_path,
      streamFile.extension
    );

    this.playerService.addPlayer(track.track_id, player);

    player.finished.subscribe(() => {
      if (this.autoPlay) {
        this.playNextTrack(track);
      }
    });

    player.playing.subscribe(() => {
      this.playerService.stopAllExcept(player);
    });
  }

  public getActiveProject(): Project {
    return this.activeProject;
  }

  public setActiveProject(project: Project) {
    this.activeProject = project;
  }

  private activeProject: Project;

  public getActiveTrack(): ReplaySubject<Track> {
    return this.activeTrack;
  }

  public setActiveTrack(track: Track) {
    this.activeTrack.next(track);
    if (track) setTimeout(() => {
      this.ref.tick();
      if (this.playerService.getPlayer(track.track_id))
          this.playerService.getPlayer(track.track_id).redraw();
      }, 4
    );
  }

  private activeTrack: ReplaySubject<Track> = new ReplaySubject<Track>();

  playNextTrack(track) {
    let tracks = this.getActiveProject().tracks;
    let nextTrack = tracks[tracks.indexOf(track) + 1];
    if (nextTrack) {
      this.playerService.getPlayer(track.track_id).unloadAudio();
      const player = this.playerService.getPlayer(nextTrack.track_id);
      player.playFromStart();
      if (this.activeTrack != null) {
        this.setActiveTrack(nextTrack);
      }
    }
  }

  public autoPlay: boolean = true;
}
