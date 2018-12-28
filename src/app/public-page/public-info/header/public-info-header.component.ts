import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../message";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PublicIntroductionComponent} from "../topics/public-introduction/public-introduction.component";
import {TermsAcceptedServiceService} from "../../../terms-accepted-service.service";
import {SubscribeComponent} from "../../../subscribe/subscribe.component";

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() message;

  constructor(private modalService: NgbModal, private termsAcceptedService: TermsAcceptedServiceService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
    // if (!this.termsAcceptedService.termsAccepted()) {
    //   this.openIntroduction();
    // }
  }

  subscribe() {
    this.modalService.open(SubscribeComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  goToPage() {
    window.history.replaceState({}, '', `/uploading-files-dev`);
  }
}
