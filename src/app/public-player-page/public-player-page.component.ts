import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../comments/comment";
import {RestUrl, Utils} from "../app.component";
import {Track} from "../model/track";
import {Project} from "../model/project";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  project: Project;

  tracks: Track[];

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.loadProjectInfo(params['project_id']);
    });
  }

  private loadProjectInfo(projectId: number) {
    Utils.sendGetRequest(RestUrl.PROJECT, [projectId], '', (response) => {
      this.project = response;
      this.loadTracks(this.project.id);
    });
  }

  private loadTracks(projectId: string) {
    let my = this;
    Utils.sendGetRequest(RestUrl.PROJECT_TRACKS, [projectId], '', (response) => {
      my.tracks = response;
      for (let track of my.tracks) {
        my.loadComments(track);
      }
    });
  }

  private loadComments(track: Track) {
    let my = this;
    Utils.sendGetRequest(RestUrl.COMMENTS, [track.last_version], "", (response) => {
      track.comments = response;
      for (let comment of track.comments) {
        my.loadReplies(comment);
      }
    });
  }

  private loadReplies(comment: Comment) {
    Utils.sendGetRequest(RestUrl.REPLIES, [comment.comment_id], "", (response) => {
      comment.replies = response;
    });
  }

  getTracks(): Track[] {
    return this.tracks;
  }
}
