import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostBinding} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TermsAcceptedServiceService} from "../terms-accepted-service.service";
import {interval} from "rxjs";
import {trigger, state, style, animate, transition} from '@angular/animations';
import { tap, delay } from "rxjs/operators";


@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
  animations: [
    trigger('openClose', [
      state('smas', style({
        opacity: 1 })),
      state('smahidden', style({
        opacity: 0,})),
      transition('smas => smahidden', [
        animate('2.5s')
      ]),
      transition('smahidden => smas', [
        animate('2.5s')
      ]),
    ]),
  ],
})
export class PublicPageComponent implements OnInit {

  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;
  @ViewChild('smaphone') smaPhone: ElementRef;

  smaToggle= 1;

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
      .pipe(tap(()=>{
        this.smaToggle=0;})
      ).pipe(delay(1750))
      .subscribe(() => {
        this.smaToggle=1;
        this.getAd();
      });
  }

  private getAd() {

    RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]))
      .then(response => {
        this.sma.nativeElement.innerHTML = response;
        this.smaPhone.nativeElement.innerHTML = response;
      });
  }

  private reset() {
    this.tryAgain.emit();
  }
}
