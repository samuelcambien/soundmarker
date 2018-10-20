import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../comments/comment";
import {RestUrl, Utils} from "../app.component";
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Player} from "../newplayer/player";
import {Message} from "../message";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  project: Project;

  tracks: Track[];
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

  private loadProjectInfo(projectId: number) {

    Utils.sendGetRequest(RestUrl.PROJECT, [projectId], '')
      .then((response: Project) => {
        this.project = response;
        return Utils.sendGetRequest(RestUrl.PROJECT_TRACKS, [this.project.id], '')

      }).then((response: Track[]) => {
        this.tracks = response;

        for (let track of this.tracks) {
          this.loadPlayer(track);
          this.loadComments(track);
        }

        if (this.tracks.length == 1) this.activeTrack = this.tracks[0];
      });
  }

  private loadPlayer(track: Track) {
    this.players.set(track, new Player(track.track_url, track.duration));
  }

  private loadComments(track: Track) {
    Utils.sendGetRequest(RestUrl.COMMENTS, [track.last_version], "")
      .then(response => {
        track.comments = response;
        for (let comment of track.comments) {
          this.loadReplies(comment);
        }
      });
  }

  private loadReplies(comment: Comment) {
    Utils.sendGetRequest(RestUrl.REPLIES, [comment.comment_id], "")
      .then(response => {
        comment.replies = response;
      });
  }

  pauseOtherTracks(except: Track) {
    for (let track of this.tracks) {
      if (track != except) {
        this.players.get(track).pause();
      }
    }
  }

  getMessage(): Message[] {
    if (!this.tracks) return [];
    let track = this.tracks[0];
    const messages = [
      new Message(
        "george.baker@gmail.com has uploaded " + this.tracks.length + " tracks",
        track.notes,
        false
      )
    ];
    return messages;
  }
}
