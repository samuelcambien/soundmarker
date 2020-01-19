import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbCarousel, NgbCarouselConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from "../../../../services/local-storage.service";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  images = [`../assets/topics-img/sm-intro.png`, `../assets/topics-img/intro-1.png` , `../assets/topics-img/intro-2.png`, `../assets/topics-img/intro-3.png`, `../assets/topics-img/intro-4.png`, `../assets/topics-img/intro-5.png`];

  @ViewChild('carousel') carousel: NgbCarousel;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private termsAcceptedService: LocalStorageService, config: NgbCarouselConfig) {
    config.interval = 0;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  accept() {
    this.termsAcceptedService.acceptTerms(new Date());
    this.activeModal.close();
  }


  ngOnInit() {
  }

  next(){
    this.carousel.next();
  }

  prev(){
    this.carousel.prev();
  }
}
