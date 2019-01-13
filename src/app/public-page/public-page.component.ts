import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TermsAcceptedServiceService} from "../terms-accepted-service.service";
import {interval} from "rxjs";

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;

  constructor(private modalService: NgbModal, private termsAcceptedService: TermsAcceptedServiceService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
    if (!this.termsAcceptedService.termsAccepted()) {
      this.openIntroduction();
    }

    this.getAd();
    interval(45 * 1000)
      .subscribe(() => {

        this.getAd();
      });
  }

  private getAd() {
    RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]))
      .then(response => this.sma.nativeElement.innerHTML = response);
  }

  private reset() {
    this.tryAgain.emit();
  }
}
