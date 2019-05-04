import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RestCall} from "../rest/rest-call";


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  @Input() project_id;
  email: string="";
  status: "pending" | "greatsuccess" | "error" = "pending";
  notifyID: "1" | "2" = "1";

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  subscribe() {
    RestCall.subscribe(this.project_id, this.email, this.notifyID)
      .then(() => this.status = "greatsuccess")
      .catch(() => this.status = "error");
  }

  close() {
    this.activeModal.close();
    this.status = "pending";
  }
}
