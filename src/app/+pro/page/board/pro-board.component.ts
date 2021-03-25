import {Component, OnInit, ViewChild} from '@angular/core';
import {StateService} from '../../../services/state.service';
import {Uploader} from '../../../services/uploader.service';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pro-board',
  templateUrl: './pro-board.component.html',
  styleUrls: ['./pro-board.component.scss']
})
export class ProBoardComponent implements OnInit {

  activeTrack;
  constructor(private stateService: StateService, private uploader: Uploader ) { }

  ngOnInit() {
    this.activeTrack = this.stateService.getActiveTrack().getValue();

  }

  get playerToggled(): boolean {
    return this.stateService.playerToggled;
  }
}
