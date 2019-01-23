import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../local-storage.service";
import {interval} from "rxjs";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {delay, tap} from "rxjs/operators";


@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
  animations: [
    trigger('openClose', [
      state('smas', style({
        opacity: 1,
      })),
      state('smahidden', style({
        opacity: 0,
      })),
      transition('smas => smahidden', [
        animate('400ms')
      ]),
      transition('smahidden => smas', [
        animate('500ms')
      ]),
    ]),
  ],
})
export class PublicPageComponent implements OnInit {

  // Timing parameters
  waitBeforeFirstAd = 1750; //ms
  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;
  @ViewChild('smaphone') smaPhone: ElementRef;

  smaToggle = 0;
  nextSma;

  constructor(private modalService: NgbModal, private localStorageService: LocalStorageService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
    this.localStorageService.storeVisit();
    if (!this.localStorageService.termsAccepted()) {
      this.openIntroduction();
    }
    this.getFirstAd();
    this.getNextAd();
    interval(10 * 1000)
      .pipe(tap(() => this.smaToggle = 0))
      .pipe(delay(400))
      .pipe(tap(() => this.showAd(this.nextSma)))
      .pipe(tap(() => this.getNextAd()))
      .pipe(delay(85))
      .subscribe(() => this.smaToggle = 1);
  }

  private getFirstAd() {
    return this.getAd()
      .then(response =>
        setTimeout(() => {
          this.showAd(response);
          this.smaToggle = 1;
        }, this.waitBeforeFirstAd)
      );
  }

  private getNextAd(): void {
    this.getAd()
      .then(response => this.nextSma = response);
  }

  private getAd(): Promise<string> {
    return RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]));
  }

  private showAd(ad) {
    this.sma.nativeElement.innerHTML = ad;
    this.smaPhone.nativeElement.innerHTML = ad;
  }

  private reset() {
    this.tryAgain.emit();
  }
}
