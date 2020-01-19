import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Track} from "../../../model/track";

@Component({
  selector: 'app-pro-board-projects-track',
  templateUrl: './pro-track.component.html',
  styleUrls: ['./pro-track.component.scss']
})
export class ProTrackComponent implements OnInit {

  private track: Track;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.track = await data.track;
    });
  }
}
