import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../services/local-storage.service";
import {Subject, timer} from 'rxjs';
import {delay, tap} from 'rxjs/operators';
import * as moment from "moment";
import {Utils} from '../app.component';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
})
export class PublicPageComponent implements OnInit {

  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() expired;
  @Input() message: Message;
  @Input() error;

  @Output() tryAgain = new EventEmitter();

  @ViewChild('sma') sma: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('header') header: ElementRef;

  smaId;
  nextSmaId;
  smaClass = window.innerWidth > 577 ? "sma hide-phone" : "phone-sma show-phone  rounded-lg border-0";

  adExposureTime = 45;        // in seconds
  adFadeInTime = "0.73s";     // Needs to be a string.
  adFadeOutTime = "0.5s";     // Needs to be a string.
  adInitialDelay = 350;      // in ms, this is also the delay between loading an add and showing it. (Enough time to load it)
  adTransitionWait = 500;     // in ms. Needs to be at least the adFadeOutTime or otherwise the ad's iframe is destroyed before the ad has faded out.
  adPostFetchDelay = 3500;    // Time between the ad loading in the iframe ad the ad showing.
  pageInactiveTolerance = 5;  // If there was no activity on the page in these seconds before ad refresh, the ad will wait for new user activity.

  firstAd = true;
  hiddenIframe;
  shownIframe;
  adTimer;
  screenAction = new Subject();

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

    //////////////////        Advertisement refresh algorithm.             //////////////////
    //  The idea is that the ad only refreshes if the web page is active in the browser or
    //  there has been activity detected from a moving mouse, so the page is active.
    //
    //  An ad will be loaded in a newly created iframe a few seconds before it is actually shown.
    //  The previous iframe is destroyed when the new ad is loaded.
    document.addEventListener("visibilitychange", this.toggleBrowserTab, true);           // Listen to browser tab events to set user activity to none.
    document.addEventListener("visibilitychange", this.onFocus, false);                   // In case a user has left to another tab .
    this.screenAction.subscribe(
      ()=> {
        if(this.firstAd || this.adTimer.closed) {                                                       // Launch a new advertisement cycle on user interaction.
          this.adTimer = timer(0, this.adExposureTime * 1000).pipe             // Initiate the advertisement cycle
         (tap(() => {if(!this.hiddenIframe) this.loadNextAd()}),                                  // Only load a new ad if there is not one waiting (in case page was inactive and there is already an ad waiting)
          tap(() => {if(!this.pageIsActive()) {this.adWait();}}),                                 // If page is inactive: break the chain and wait for user interaction.
          delay(this.firstAd? this.adPostFetchDelay/1.5 : this.adPostFetchDelay),                // Delay between loading an ad an refreshing the ad.
          tap(() => {this.firstAd = false; this.hideIframe(this.shownIframe)}),                   // Fadeout old ad
          delay(this.adTransitionWait),                                                                 // Wait for fadeout before destroying the iframe
          tap(() => this.destroyIframe(this.shownIframe))                                         // Destroy the old iframe
         ).subscribe(() => this.showIframe(this.hiddenIframe))                                    // Fade in the new iframe
      }}
    );

    if(document.visibilityState=="visible") {
      setTimeout(() => this.screenAction.next(), this.adInitialDelay);
    }                                                                                                   // Launch advertisement algorithm for the first time if tab is open.

    if (window.addEventListener) {
      window.addEventListener("message", this.clickSma.bind(this), false);
    }

    this.header.nativeElement.addEventListener("wheel", event => {
      this.contentScroll(event.deltaY);
    });

    this.sma.nativeElement.addEventListener("wheel", event => {
      this.contentScroll(event.deltaY);
    });
  }

  // Registering a click and opening the ad.
  private clickSma(event) {
      if (event.origin !== Utils.getSmaDomain()) return; // Make sure that the click from the iframe click is coming from the correct domain.

      if(event.data) {
        if (Number.isInteger(event.data)) {
          this.contentScroll(event.data);
          return
        } else {
          RestCall.logSmaClick(this.smaId).then(() => window.open(event.data, "blank_"));
        }
      }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////              MANAGE IFRAMES FUNCTIONS             /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Fetch next ad.
  private loadNextAd(): Promise<any> {
    return RestCall.getRandSma(this.smaId)
      .then(response => {
        if(response["html"]){
          this.hiddenIframe = this.createIframe(response["html"]);
          this.nextSmaId=response["sma_id"];}
        else{
          this.adTimer.unsubscribe();                                         // If there is no add fetched from the backend stop the refresh algorithm for this session.
          this.screenAction.unsubscribe();
          document.removeEventListener("visibilitychange", this.toggleBrowserTab, true);
          document.removeEventListener("visibilitychange", this.onFocus, false);
        }
        }
      );
  }

  // Create new iframe with src of external webpage.
  private createIframe(src){
    let iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('scrolling', "no");
    iframe.setAttribute('style','width:100%; height:100%; border:none; opacity: 0;');
    this.sma.nativeElement.appendChild(iframe);
    return iframe;
  }

  // Fade in iframe
  private showIframe(iframe){
    if(iframe) {
      this.smaId = this.nextSmaId;
      RestCall.logSmaImpression(this.smaId).then(()=>{
        iframe.style.animation = 'shown-sma ' + this.adFadeInTime + ' forwards';
        this.shownIframe = this.hiddenIframe;
        this.hiddenIframe = null;
        });
      }
    }

  // Fade out iframe
  private hideIframe(iframe){
    if(iframe) {
      iframe.style.animation = 'hidden-sma ' + this.adFadeOutTime + ' forwards';
    }
  }

  // Destroy iframe
  private destroyIframe(iframe) {
    if (iframe) {
      iframe.remove();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////          FUNCTIONS TO MONITOR USER ACTIVITY             ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  mostRecentUserActivity = null;            // When the page is active = null. When the page is inactive, it stores the time of the most recent activity.
  browserPrefix = this.getHiddenPrefix();

  // Breaks the advertisement cycle and waits for a user interaction to restart a new cycle and update the ad.
  private adWait(){
    this.firstAd = true;
    this.adTimer.unsubscribe();
    document.addEventListener('mouseover', this.onVisibilityChange, true);
    document.addEventListener('focus', this.onFocus, false);
    document.addEventListener("visibilitychange", this.onFocus, false);
  }

  // Little workaround to make browser tab changes work in the algorithm.
  // When going to another tab: set the user activity way in the past.
  // When going back to page: set user activity to null.
  toggleBrowserTab = () => {
      if(document.visibilityState == this.browserPrefix)  {
        let t = new Date('2019-03-12T00:00:00');       // This is a work around for when a user is in another tab the most user activity goes far in the past.
        this.mostRecentUserActivity = t;
        document.addEventListener("visibilitychange", this.onFocus, false);
      }
      else{
        this.mostRecentUserActivity = null;
      }
  };

  // Returns true if the page is considered to be active.
  pageIsActive(): boolean{
    if(this.mostRecentUserActivity){
      let sec = moment(new Date()).diff(moment(this.mostRecentUserActivity), 'seconds');
      return (sec < this.pageInactiveTolerance);
    }
    return true;
  }

  // Returns true if the page is considered to be active.
  private mouseEventHandler = () => {
    this.updateMostRecentUserActivity();
  };

  // If user goes away from window, start listening for different types of user activity.
  @HostListener('window:blur', ['$event'])
  onBlurOut(event){
      if(document.visibilityState != this.browserPrefix){
          this.updateMostRecentUserActivity();
          document.addEventListener("mouseover", this.mouseEventHandler, true);
      }
      document.addEventListener('focus', this.onFocus, false);
  }

  @HostListener('window:focus', ['$event'])
  onFocusIn(){
    document.removeEventListener("mouseover", this.mouseEventHandler, true);
  }

  onFocus = () => {
    if(document.visibilityState == 'visible') {
      document.removeEventListener("visibilitychange", this.onFocus, false);
      document.removeEventListener('focus', this.onFocus, false);
      document.removeEventListener('mouseover', this.onVisibilityChange, true);
      this.mostRecentUserActivity = null;
      if(this.adTimer.closed) this.screenAction.next();
    }
  };

  onVisibilityChange = () => {
    if(document.visibilityState == "visible") {
      document.removeEventListener('mouseover', this.onVisibilityChange, true);
      this.updateMostRecentUserActivity();
      if(this.adTimer.closed) this.screenAction.next();
    }
  };

  private updateMostRecentUserActivity(){
    let t = new Date();
    this.mostRecentUserActivity = t;
  }

  // Browser user activity (page visibility API) has different prefixes in different browser.
  getHiddenPrefix(): string{
    let prefixes = ['webkit','moz','ms','o'];
    if ('hidden' in document) return 'hidden';
    for (let i = 0; i < prefixes.length; i++){
      if ((prefixes[i] + 'Hidden') in document)
        return prefixes[i] + 'Hidden';
    }
    return null;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Change class of ads when browser is resized.
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.smaClass = window.innerWidth > 577 ? "sma hide-phone" : "phone-sma show-phone  rounded-lg border-0";
  }

  private reset() {
    this.tryAgain.emit();
  }

  contentScroll(deltaY){
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollTop + deltaY;
  }
}
