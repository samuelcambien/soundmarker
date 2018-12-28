import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RestCall} from "../rest/rest-call";

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  email: string;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  subscribe() {
    RestCall.subscribe("", this.email.split(","));
    this.close();
  }

  close() {
    this.activeModal.close();
  }
}
