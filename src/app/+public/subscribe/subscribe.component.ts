import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RestCall} from "../../rest/rest-call";


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent implements OnInit {

  @Input() project_id;
  email: string="";
  status: "pending" | "greatsuccess" | "error" = "pending";

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  subscribe() {
    RestCall.subscribe(this.project_id, this.email, "2")
      .then(() => {this.status = "greatsuccess";
      this.cdr.detectChanges();})
      .catch(() => {this.status = "error";this.cdr.detectChanges();});
  }

  close() {
    this.activeModal.close();
    this.status = "pending";
  }
}
