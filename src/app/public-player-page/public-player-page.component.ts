import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Track} from "../model/track";
import {Project} from "../model/project";
import {Message} from "../message";
import {Version} from "../model/version";
import {PlayerService} from "../services/player.service";
import {ProjectService} from "../services/project.service";
import {Observable} from "rxjs";
import {Player} from "../player";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-public-player',
  templateUrl: './public-player-page.component.html',
  styleUrls: ['./public-player-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cdr.detectChanges();
      this.projectService.loadProject(params['project_hash'])
        .then(() => {

          this.project = this.projectService.getActiveProject();
          this.initFields();

          if (this.getProject().tracks.length == 1)
            this.projectService.setActiveTrack(this.getProject().tracks[0]);

          this.cdr.detectChanges();
        })
    });
    this.getActivePlayer().subscribe(
      player => player.redraw()
    );
  }

  getActiveTrack(): Observable<Track> {
    return this.projectService.getActiveTrack();
  }

  setActiveTrack(track: Track) {
    this.projectService.setActiveTrack(track);
  }

  getActivePlayer(): Observable<Player> {
    return this.getActiveTrack()
      .pipe(filter(track => track != null))
      .pipe(map(track => this.getPlayer(track.track_id)));
  }

  getPlayer(trackId: string) {
    return this.playerService.getPlayer(trackId);
  }

  selectTrack(track: Track) {
    this.projectService.setActiveTrack(track);
  }

  getMessage(project: Project, version: Version): Message {
    let track = "track";
    if(project.tracks.length >1){
       track = "tracks";
    }
    return new Message(
      project.tracks.length + " " + track + " added" + (project.email_from ? " by " + project.email_from : ""),
      version.notes,
      false,
      !this.expired
    );
  }

  backToHome() {
    this.router.navigate(['./']);
  }

  private getProject() {
    return this.project;
  }

  private initFields() {

    if (this.project.project_id == null) {
      this.exists = false;
      this.message = null;
      return;
    }

    if (!this.projectService.isActive(this.project)) {
      this.expired = true;
      if (!this.projectService.areCommentsActive(this.project)) {
        this.commentsExpired = true;
      }
      this.message = null;
    }

    this.expiry_date = this.project.expiration.substr(0, 10);

    if (this.project.sender) {
      this.sender = "by " + this.project.sender;
    }

    this.message = this.getMessage(this.project, this.project.tracks[0].versions[0]);
    if (this.message.text == '') {
      this.message.text = "No notes included";
    }
  }
}
