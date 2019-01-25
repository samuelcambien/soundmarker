import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../local-storage.service";
import {interval} from "rxjs";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {delay, map, tap} from "rxjs/operators";


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
        animate('325ms')
      ]),
      transition('smahidden => smas', [
        animate('325ms')
      ]),
    ]),
  ],
})
export class PublicPageComponent implements OnInit {

  // Timing parameters
  waitBeforeFirstAd = 2750; //ms
  exposureTime = 45;

  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;
  @ViewChild('smaphone') smaPhone: ElementRef;

  smaToggle = 0;
  smaId: string;
  smaHtml;

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
    interval(this.exposureTime * 1000)
      .pipe(map(() => this.getNextAd()))
      .pipe(tap(() => this.smaToggle = 0))
      .pipe(delay(200))
      .pipe(tap(() => this.showAd(this.smaHtml)))
      .pipe(delay(200))
      .subscribe(() => this.smaToggle = 1);
  }

  private getFirstAd() {
    return this.getAd()
      .then(response => {
        this.smaHtml = response;
          setTimeout(() => {
            this.showAd(response);
          }, this.waitBeforeFirstAd / 2)
        }
      ).then(() =>
        setTimeout(() => {
          this.smaToggle = 1;
        }, this.waitBeforeFirstAd / 2)
      );
  }

  private getNextAd(): Promise<any> {
    return RestCall.getNextAdId(this.smaId, this.exposureTime)
      .then(response =>
        this.smaId = response["ad_id"]
      ).then(() =>
        RestCall.getAd(this.smaId)
      ).then(response => {
        if (response) this.smaHtml = response;
      });
  }

  private getAd(): Promise<string> {
    return RestCall.getAdId()
      .then(response => {
        this.smaId = response["ad_id"];
        return RestCall.getAd(this.smaId)
      });
  }

  private showAd(ad) {
    this.sma.nativeElement.innerHTML = ad;
    this.smaPhone.nativeElement.innerHTML = ad;
  }

  private reset() {
    this.tryAgain.emit();
  }
}
