import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../local-storage.service";
import {interval, Observable, timer} from "rxjs";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {delay, map, tap} from "rxjs/operators";


@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
  animations: [
    trigger('openClose', [
      state('shown', style({
        opacity: 1,
      })),
      state('hidden', style({
        opacity: 0,
      })),
      transition('shown => hidden', [
        animate('7431ms')
      ]),
      transition('hidden => shown', [
        animate('7431ms')
      ]),
    ]),
  ],
})
export class PublicPageComponent implements OnInit {

  exposureTime = 45;

  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;
  @ViewChild('smaphone') smaPhone: ElementRef;

  smaVisibility: string = "shown";
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
    this.loadFirstAd()
      .then(() =>
        timer(0, this.exposureTime * 1000)
          .pipe(tap(() => this.showAd()))
          .pipe(tap(() => this.smaVisibility = "hidden"))
          .pipe(delay(200))
          .pipe(tap(() => this.smaVisibility = "shown"))
          .subscribe(() => this.loadNextAd())
      );
  }

  private loadFirstAd(): Promise<any> {
    return RestCall.getAdId()
      .then(response => this.saveAd(response));
  }

  private loadNextAd(): Promise<any> {
    return RestCall.getNextAdId(this.smaId, this.exposureTime)
      .then(response => this.saveAd(response));
  }

  private saveAd(response): Promise<any> {
    this.smaId = response["ad_id"];
    return RestCall.getAd(this.smaId)
      .then(response => {
        this.smaHtml = response;
      });
  }

  private changeAd(interval: Observable<number>) {
    interval
      .pipe(tap(() => this.smaVisibility = "shown"))
      .pipe(delay(200))
      .pipe(tap(() => this.showAd()))
      .pipe(delay(200))
      .pipe(tap(() => this.smaVisibility = "hidden"))
      .pipe(map(() => this.loadNextAd()))
  }

  private showAd() {
    this.sma.nativeElement.innerHTML = this.smaHtml;
    this.smaPhone.nativeElement.innerHTML = this.smaHtml;
  }

  private reset() {
    this.tryAgain.emit();
  }
}
