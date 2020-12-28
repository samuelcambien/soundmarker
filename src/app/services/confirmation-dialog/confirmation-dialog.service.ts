import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from "./confirmation-dialog.component";

@Injectable()
export class ConfirmDialogService {

  constructor(
    private modalService: NgbModal,
  ) {
  }

  public confirm(): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    return modalRef.result;
  }
}
