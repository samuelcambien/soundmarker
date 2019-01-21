import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostBinding} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../local-storage.service";
import {interval} from "rxjs";
import {trigger, state, style, animate, transition} from '@angular/animations';
import { tap, delay } from "rxjs/operators";
import {resolve} from 'q';


@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
  animations: [
    trigger('openClose', [
      state('smas', style({
        opacity: 1, })),
      state('smahidden', style({
        opacity: 0,})),
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

  smaToggle= 0;

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
    this.getAd(this.waitBeforeFirstAd);
    interval(45 * 1000)
      .pipe(tap(()=>{
        this.smaToggle=0;})
      ).pipe(delay(400))
      .pipe(tap(() => {
        this.getAd(0);
      }))
      .pipe(delay(85))
      .subscribe(()=>this.smaToggle=1);
  }

  private getAd(initial) {

    RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]))
      // .then(x => new Promise(resolve => setTimeout(() => resolve(x), initial)))
      .then(response => {
        this.sma.nativeElement.innerHTML = response;
        this.smaPhone.nativeElement.innerHTML = response;
        return new Promise(resolve => setTimeout(() => resolve(response), initial))})
      .then(response => {
        if(initial){
            this.smaToggle= 1}
      });
  }

  private reset() {
    this.tryAgain.emit();
  }
}
