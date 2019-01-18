import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Comment} from "../model/comment";
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {File} from "../model/file";
import {Version} from "../model/version";
import {PlayerService} from "../player.service";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss']
})
export class PublicPlayerPageComponent implements OnInit {

  expired: boolean = false;
  exists: boolean = true;

  project: Project;
  expiry_date;
  sender;
  project_id: string;

  message: Message = new Message("", "", false);

  activeTrack: Track;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProjectInfo(params['project_hash']);
    });
    window.onresize = () => this.getActivePlayer().redraw();
  }

  private loadProjectInfo(projectHash: string) {


    RestCall.getProject(projectHash)
      .then((project: Project) => {
        this.project_id = project.project_id;
        this.project = project;
        this.expiry_date =  'unknown expiry date';
        this.sender ='unknown sender';

        if (!this.doesExist()) {
          this.exists = false;
          this.message = null;
          return;
        }

        if (!this.isActive()) {
          this.expired = true;
          this.message = null;
          return;
        }

        for (let track of project.tracks) {
          track.versions = RestCall.getTrack(track.track_id)
            .then(response => response["versions"]);
          track.versions
            .then((versions: Version[]) => {
              this.message = this.getMessage(project, versions[0]);
              if(this.message.text==''){
                this.message.text="No notes included";
              }
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
      });
  }

  private doesExist() {
    return this.project.project_id != null;
  }

  private isActive() {
    return this.project.status == "active";
  }

  private loadPlayer(track: Track, version: Version, file: File) {
    // this.playerService.addPlayer(track.track_id, new Player(file.aws_path, version.track_length));
  }

  getActivePlayer() {
    return this.getPlayer(this.activeTrack.track_id);
  }

  getPlayer(trackId: string) {
    return this.playerService.getPlayer(trackId);
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
        this.playerService.getPlayer(track.track_id).pause();
      }
    }
  }

  selectTrack(track: Track) {
    this.activeTrack = track;
    setTimeout(() => this.getPlayer(track.track_id).redraw(), 4);
  }

  getMessage(project: Project, version: Version): Message {
    return new Message(
      project.tracks.length + " tracks added" + (project.email_from ? " by " + project.email_from : ""),
      version.notes,
      false);
  }
}
