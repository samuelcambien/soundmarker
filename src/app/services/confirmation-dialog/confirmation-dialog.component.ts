import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  message: string;

  constructor(
    private activeModal: NgbActiveModal,
  ) {
  }

  accept() {
    this.activeModal.close(true);
  }

  decline() {
    this.activeModal.close(false);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
