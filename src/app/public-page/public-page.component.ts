import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../services/local-storage.service";
import { LoadableComponentIds } from '../modules/app-loadable.manifests';

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
})
export class PublicPageComponent implements OnInit, AfterViewInit {

  @Input() project_id;
  @Input() sender;
  @Input() expiry_date;
  @Input() expired;
  @Input() message: Message;
  @Input() error;

  @Output() tryAgain = new EventEmitter();

  @ViewChild('content') content: ElementRef;
  @ViewChild('header') header: ElementRef;

  SMA_COMPONENT_ID: string = LoadableComponentIds.SMA;

  // flags to load components
  // setting this to 'true' will cause the loadable component
  // to load the specified component id
  smaComponent: boolean = true;

  constructor(private modalService: NgbModal, private localStorageService: LocalStorageService) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {size: "lg", backdrop: 'static', keyboard: false});
  }

  ngOnInit() {
    this.header.nativeElement.addEventListener("wheel", event => {
      this.contentScroll(event.deltaY);
    });
    this.smaComponent = false;
  }

  ngAfterViewInit() {
    this.localStorageService.storeVisit();
    setTimeout(() => {
      if (!this.localStorageService.termsAccepted()) {
        this.openIntroduction();
     }});
  }

  private reset() {
    this.tryAgain.emit();
  }

  contentScroll(deltaY){
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollTop + deltaY;
  }
}
