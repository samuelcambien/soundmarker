import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TermsAcceptedServiceService} from "../terms-accepted-service.service";

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  @Input() message: Message;
  @Input() error;
  @Output() tryAgain=new EventEmitter();

  ad;

  constructor(private modalService: NgbModal, private termsAcceptedService: TermsAcceptedServiceService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
     if (!this.termsAcceptedService.termsAccepted()) {
       this.openIntroduction();
     }
    RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]))
      .then(response => this.ad = response);
  }

  private reset() {
      this.tryAgain.emit();
  }
}
