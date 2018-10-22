import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../model/comment";
import {RestUrl, Utils} from "../app.component";
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Player} from "../newplayer/player";
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {File} from "../model/file";
import {Version} from "../model/version";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  project: Project;

  players: Map<Track, Player> = new Map();

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

    RestCall.getProject(projectHash)
      .then((response: Project) => {
        this.project = response;

        for (let track of this.project.tracks) {
          RestCall.getTrack(track.track_id)
            .then(response => track.versions = response["versions"])
            .then(() => RestCall.getVersion(track.versions[0].version_id))
            .then(response => track.versions[0].files = response["files"])
            .then(() => {
              this.loadComments(track);
              this.loadPlayer(track, track.versions[0], track.versions[0].files[0]);
            });
        }

        if (this.project.tracks.length == 1) this.activeTrack = this.project.tracks[0];
      });
  }

  private loadPlayer(track: Track, version: Version, file: File) {
    this.players.set(track, new Player(file.aws_path, version.track_length));
  }

  private loadComments(track: Track) {
    RestCall.getComments(track.versions[0].version_id)
      .then(response => {
        let allComments: Comment[] = response["comments"];
        track.comments = allComments.filter(comment => comment.parent_comment_id == 0);
        for (let comment of track.comments) {
          comment.version_id = track.versions[0].version_id;
          this.loadReplies(comment, allComments);
        }
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

  getMessage(): Message[] {
    // if (!this.project.tracks) return [];
    // let track = this.project.tracks[0];
    const messages = [
      new Message(
        "george.baker@gmail.com has uploaded 3 tracks",
        "",
        false
      )
    ];
    return messages;
  }
}
