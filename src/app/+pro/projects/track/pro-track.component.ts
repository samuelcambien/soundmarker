import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Track} from "../../../model/track";
import {Project} from "../../../model/project";
import {RestCall} from "../../../rest/rest-call";
import {AudioSource} from "../../../player/player.service";

@Component({
  selector: 'app-pro-board-projects-track',
  templateUrl: './pro-track.component.html',
  styleUrls: ['./pro-track.component.scss']
})
export class ProTrackComponent implements OnInit {

  private project: Project;
  private track: Track;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.project = await data.project;
      this.track = await data.track;
      this.track.versions.forEach(async version => {
        version.files = (await RestCall.getVersion(version.version_id))["files"];
      });
    });
  }

  get audioSource(): AudioSource {
    return {
      track: this.track,
      version: this.track.versions[0],
    };
  }
}
