import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from "./confirmation-dialog.component";

@Injectable()
export class ConfirmDialogService {

  constructor(
    private modalService: NgbModal,
  ) {
  }

  public confirm(message?: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    // (modalRef.componentInstance as ConfirmDialogComponent).message = message;
    return modalRef.result;
  }
}
