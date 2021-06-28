import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-loggedout-dialog',
  templateUrl: 'loggedout-dialog.component.html',
  styleUrls: ['loggedout-dialog.component.scss']
})
export class LoggedOutDialogComponent {

  message: string;

  constructor(
    private activeModal: NgbActiveModal,
  ) {
  }

  login() {
    // window.location.href = "https://www.leapwingaudio.com/oauth/authorize/?response_type=code&client_id=zpRv44GCdzGikMHOT7artGXiGiJ7ttVVdg3TKfgw&state=soundmarkerpro&redirect_uri=http://localhost/callback.php"
    // window.location.href = "https://www.leapwingaudio.com/oauth/authorize/?response_type=code&client_id=O7mazXp53IMKB7kF7meEH4AiuPJDTJwIuZEBw3dT&state=soundmarkerpro&redirect_uri=http://localhost/callback.php";
  }
}
