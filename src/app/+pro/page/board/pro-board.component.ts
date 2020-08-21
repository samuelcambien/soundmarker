import { Component, OnInit } from '@angular/core';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-pro-board',
  templateUrl: './pro-board.component.html',
  styleUrls: ['./pro-board.component.scss']
})
export class ProBoardComponent implements OnInit {

  activeTrack;
  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.activeTrack = this.stateService.getActiveTrack().getValue();
  }

  get playerToggled(): boolean {
    return this.stateService.playerToggled;
  }
}
