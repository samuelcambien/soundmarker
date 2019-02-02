import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from "../model/comment";
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {Version} from "../model/version";
import {PlayerService} from "../player.service";
import {interval} from "rxjs";
import * as moment from "moment";
import {now} from "moment";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  exists: boolean = true;
  expired: boolean = false;
  commentsExpired = false;

  project: Project;
  expiry_date;
  sender;
  project_id: string;

  error;

  message: Message = new Message("", "", false, false);

  activeTrack: Track;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProjectInfo(params['project_hash']);
    });
    window.onresize = () => {
      if (this.getActivePlayer())
        this.getActivePlayer().redraw();
    };
  }

  private loadProjectInfo(projectHash: string) {

    RestCall.getProject(projectHash)
      .then((project: Project) => {
        this.project_id = project.project_id;
        this.project = project;

        if (!this.doesExist()) {
          this.exists = false;
          this.message = null;
        }

        if (!this.isActive()) {
          this.expired = true;
          if (!this.areCommentsActive()) {
            this.commentsExpired = true;
          }
          this.message = null;
        }

        this.expiry_date = project.expiration.substr(0, 10);

        if (project.sender) {
          this.sender = "by " + project.sender;
        }

        for (let track of project.tracks) {
          track.versions = RestCall.getTrack(track.track_id)
            .then(response => response["versions"]);
          track.versions
            .then((versions: Version[]) => {
              this.message = this.getMessage(project, versions[0]);
              if (this.message.text == '') {
                this.message.text = "No notes included";
              }
              versions.forEach(version => {
                if (version.downloadable == 0) version.downloadable = false
              });
              versions[0].files = RestCall.getVersion(versions[0].version_id)
                .then(response => versions[0].files = response["files"]);
              versions[0].files.then(() => {
                this.loadComments(track, versions[0].version_id);
                interval(20 * 1000)
                  .subscribe(() => this.loadComments(track, versions[0].version_id))
              })
            });

          if (project.tracks.length == 1)
            this.activeTrack = project.tracks[0];
        }
      });
  }

  private doesExist() {
    return this.project.project_id != null;
  }

  private isActive() {
    return this.project.status == "active";
  }

  private areCommentsActive() {
    return this.project.status != "expired";
  }

  getActivePlayer() {
    return this.activeTrack && this.getPlayer(this.activeTrack.track_id);
  }

  getPlayer(trackId: string) {
    return this.playerService.getPlayer(trackId);
  }

  private loadComments(track: Track, version_id: string) {
    RestCall.getComments(version_id)
      .then(response => {
        let allComments: Comment[] = response["comments"];
        track.comments = (track.comments || [])
          .concat(
            allComments
              .filter(comment => comment.parent_comment_id == 0)
              .filter(comment =>
                !(track.comments || [])
                  .map(loadedComment => loadedComment.comment_id)
                  .includes(comment.comment_id)
              )
          );
        for (let comment of track.comments) {
          if (comment.include_end == 0) comment.include_end = false;
          if (comment.include_start == 0) comment.include_start = false;
          comment.version_id = version_id;
          this.loadReplies(comment, allComments);
        }
      })
  }

  private loadReplies(comment: Comment, allComments: Comment[]) {
    comment.replies = allComments.filter(reply => reply.parent_comment_id == comment.comment_id);
  }

  pauseOtherTracks(except: Track) {
    for (let track of this.project.tracks) {
      if (track != except) {
        this.playerService.getPlayer(track.track_id).pause();
      }
    }
  }

  selectTrack(track: Track) {
    this.activeTrack = track;
    setTimeout(() => {
        if (this.getPlayer(track.track_id))
          this.getPlayer(track.track_id).redraw();
      }, 4
    );
  }

  getMessage(project: Project, version: Version): Message {
    return new Message(
      project.tracks.length + " tracks added" + (project.email_from ? " by " + project.email_from : ""),
      version.notes,
      false,
      !this.expired
    );
  }

  backToHome() {
    this.router.navigate(['./']);
  }
}
