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
  successMessage = '';
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert;
  constructor(private stateService: StateService, private uploader: Uploader ) { }

  ngOnInit() {
    this.activeTrack = this.stateService.getActiveTrack().getValue();

    this.stateService.getAlert().subscribe(message => this.successMessage = message);

  }
  public changeSuccessMessage() { this.stateService.setAlert("spannend"); }

  get playerToggled(): boolean {
    return this.stateService.playerToggled;
  }

  public closeAlert(){
    this.stateService.setAlert("");
  }
}
