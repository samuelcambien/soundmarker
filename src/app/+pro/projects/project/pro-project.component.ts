import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../model/project";

@Component({
  selector: 'app-pro-board-projects-project',
  templateUrl: './pro-project.component.html',
  styleUrls: ['./pro-project.component.scss']
})
export class ProProjectComponent implements OnInit {

  project: Project;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.project = await data.project;
    });
  }
}
