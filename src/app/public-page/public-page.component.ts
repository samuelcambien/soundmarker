import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Message} from "../message";
import {PublicIntroductionComponent} from "./public-info/topics/public-introduction/public-introduction.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../services/local-storage.service";
import { LoadableComponentIds } from '../modules/app-loadable.manifests';
import {SmaComponentOutputs} from '../modules/sma.outputs.module'

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss'],
})
export class PublicPageComponent implements OnInit {

  @Input() project_id;
  // @Input() sender;
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
  smaComponent: boolean = false;

  constructor(private modalService: NgbModal, private localStorageService: LocalStorageService, private cdr: ChangeDetectorRef) {
  }

  openIntroduction() {
    this.modalService.open(PublicIntroductionComponent, {windowClass: "intro-modal", keyboard: false});
  }

  ngOnInit() {
    this.header.nativeElement.addEventListener("wheel", event => {
      this.contentScroll(event.deltaY);
    });

    // setTimeout(() => {
    //   if (this.localStorageService.termsAccepted()) {
    //     this.openIntroduction();
    //   }});

    setTimeout(() => {
        this.smaComponent = !this.smaComponent;
        this.cdr.detectChanges()
      }
      , 1500);

    this.termsAccepted=  false;
     if (this.localStorageService.termsAccepted()) this.termsAccepted = true;
  }

  acceptTerms(){
    this.termsAccepted = true;
  }

  termsAccepted = false;

  get smaOutputs(): SmaComponentOutputs {
    return {
      scroll: (deltaY: number) => this.contentScroll(deltaY)
    }
  }

  private reset() {
    this.tryAgain.emit();
  }

  contentScroll(deltaY){
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollTop + deltaY;
  }

  loadSMA(){
    return this.smaComponent;
  }
}
