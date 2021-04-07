import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from "./confirmation-dialog.component";

@Injectable()
export class ConfirmDialogService {

  constructor(
    private modalService: NgbModal,
  ) {
  }

  public confirm(message?: string, ok_true?: string, cancel_false?: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    (modalRef.componentInstance as ConfirmDialogComponent).message = message;
    (modalRef.componentInstance as ConfirmDialogComponent).ok_true = ok_true;
    (modalRef.componentInstance as ConfirmDialogComponent).cancel_false = cancel_false;
    return modalRef.result;
  }
}
