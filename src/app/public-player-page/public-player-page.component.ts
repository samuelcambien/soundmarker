import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../model/comment";
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Player} from "../newplayer/player";
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {File} from "../model/file";
import {Version} from "../model/version";
import {Observable} from "rxjs";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  project: Project;

  players: Map<Track, any> = new Map();

  message: Promise<Message>;

  activeTrack: Track;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProjectInfo(params['project_hash']);
    });
  }

  private loadProjectInfo(projectHash: string) {

    this.message = new Promise<Message>(resolve =>
      RestCall.getProject(projectHash)
        .then((project: Project) => {
          this.project = project;
          for (let track of project.tracks) {
            track.versions = RestCall.getTrack(track.track_id)
              .then(response => response["versions"]);
            track.versions
              .then((versions: Version[]) => {
                resolve(this.getMessage(project, versions[0]));
                versions.forEach(version => {
                  if (version.downloadable == 0) version.downloadable = false
                });
                versions[0].files = RestCall.getVersion(versions[0].version_id)
                  .then(response => versions[0].files = response["files"]);
                versions[0].files.then((files) => {
                  // this.loadPlayer(track, versions[0], files[0]);
                  this.loadComments(track);
                })
              });

            if (project.tracks.length == 1)
              this.activeTrack = project.tracks[0];
          }
        })
    );
  }

  private loadPlayer(track: Track, version: Version, file: File) {
    this.players.set(track, new Player(file.aws_path, version.track_length));
  }

  private loadComments(track: Track) {
    track.versions.then((versions: Version[]) => {
      RestCall.getComments(versions[0].version_id)
        .then(response => {
          let allComments: Comment[] = response["comments"];
          track.comments = allComments.filter(comment => comment.parent_comment_id == 0);
          for (let comment of track.comments) {
            if (comment.include_end == 0) comment.include_end = false;
            if (comment.include_start == 0) comment.include_start = false;
            comment.version_id = versions[0].version_id;
            this.loadReplies(comment, allComments);
          }
        })
    });
  }

  private loadReplies(comment: Comment, allComments: Comment[]) {
    comment.replies = allComments.filter(reply => reply.parent_comment_id == comment.comment_id);
  }

  pauseOtherTracks(except: Track) {
    for (let track of this.project.tracks) {
      if (track != except) {
        this.players.get(track).pause();
      }
    }
  }

  getMessage(project: Project, version: Version): Message {
    return new Message(
      project.tracks.length + " tracks added" + (project.email_from ? " by " + project.email_from : ""),
      version.notes,
      false);
  }
}
