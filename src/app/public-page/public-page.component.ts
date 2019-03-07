import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../services/local-storage.service";
import {Subject, timer} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
})
export class PublicPageComponent implements OnInit {

  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() message: Message;
  @Input() error;
  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;

  smaId: string;
  smaClass = window.innerWidth > 577 ? "sma hide-phone" : "phone-sma show-phone  rounded-lg border-0";

  hiddenIframe;
  shownIframe;

  adExposureTime = 10; // in seconds
  adFadeInTime = "0.75s"; // Needs to be a string.
  adFadeOutTime = "0.5s"; // Needs to be a string.
  adInitialDelay = 1850;  // in ms, this is also the delay between loading an add and showing it. (Enough time to load it)
  adTransitionWait = 500; // in ms. Needs to be at least the adFadeOutTime or otherwise the ad's iframe is destroyed before the ad has faded out.

  screenActive = new Subject();

  constructor(private modalService: NgbModal, private localStorageService: LocalStorageService, private sanitizer: DomSanitizer) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  adTimer;

  ngOnInit() {
    this.localStorageService.storeVisit();
    if (!this.localStorageService.termsAccepted()) {
      this.openIntroduction();
    }
    this.smaId = "1"

    this.adTimer = timer(0, 300000).subscribe(()=>{});
    this.adTimer.unsubscribe();

    this.screenActive.subscribe(
      ()=> {
        if(this.adTimer.closed) {
          this.adTimer = timer(0, this.adExposureTime * 1000).pipe
         (tap(() => {if(!this.hiddenIframe) this.loadNextAd()}),
          tap(() => {if(document.visibilityState == "hidden") {this.adTimer.unsubscribe()};}),
          delay(this.adInitialDelay),
          tap(() => this.hideIframe(this.shownIframe)),
          delay(this.adTransitionWait),
          tap(() => this.destroyIframe(this.shownIframe))
         ).subscribe(() => this.showIframe(this.hiddenIframe))
      }}
    );

    this.screenActive.next("true");

    document.addEventListener("visibilitychange",
      () => {if(document.visibilityState == "visible") this.screenActive.next("true")});
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.smaClass = window.innerWidth > 577 ? "sma hide-phone" : "phone-sma show-phone  rounded-lg border-0";
  }

  private loadNextAd(): Promise<any> {
    return RestCall.getNextAdId(this.smaId, this.adExposureTime)
      .then(response => this.saveAd(response));
  }

  private saveAd(response): Promise<any> {
    this.smaId = response["ad_id"];
    return RestCall.getAd(this.smaId)
      .then(response => {
        this.hiddenIframe = this.createIframe(response);
      });
  }


  private reset() {
    this.tryAgain.emit();
  }

  createIframe(src){
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('scrolling', "no");
    iframe.setAttribute('style','width:100%; height:100%; border:none; opacity: 0;');
    this.sma.nativeElement.appendChild(iframe);
    return iframe;
  }

  showIframe(iframe){
    if(iframe) {
      console.log("fadein")
      iframe.style.animation = 'shown-sma ' + this.adFadeInTime + ' forwards';
      this.shownIframe = this.hiddenIframe;
      this.hiddenIframe = null;
    }
  }

  hideIframe(iframe){
    if(iframe) {
      console.log("fadeout");
      iframe.style.animation = 'hidden-sma ' + this.adFadeOutTime + ' forwards';
    }
  }

  destroyIframe(iframe){
    if(iframe) {
      iframe.remove();
    }

  }
}
