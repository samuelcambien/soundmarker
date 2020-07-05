import { Component, OnInit } from '@angular/core';
import {RestCall} from '../../rest/rest-call';
import {StateService} from '../../services/state.service';

@Component({
  selector: 'app-pro-board-projects',
  templateUrl: './pro-board-projects.component.html',
  styleUrls: ['./pro-board-projects.component.scss']
})
export class ProBoardProjectsComponent implements OnInit {

  constructor(private stateService: StateService) { }
  user_project_list;

  ngOnInit() {
    try{
      RestCall.getProjects().then(res => this.user_project_list = res["projects"]);
    }
    catch{
    }
  }
}
