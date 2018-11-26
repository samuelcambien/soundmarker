import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../message";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PublicIntroductionComponent} from "../topics/public-introduction/public-introduction.component";
import {TermsAcceptedServiceService} from "../../../terms-accepted-service.service";

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() messages: Promise<Message>;
  message;

  constructor(private modalService: NgbModal, private termsAcceptedService: TermsAcceptedServiceService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
    if (!this.termsAcceptedService.termsAccepted()) {
      this.openIntroduction();
    }
    if (this.messages) this.messages.then(message => this.message = message);
  }

  goToPage() {
    window.history.replaceState({}, '', `/uploading-files-dev`);
  }
}
