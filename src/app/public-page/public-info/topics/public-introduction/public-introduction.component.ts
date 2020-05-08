import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbCarousel, NgbCarouselConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from "../../../../services/local-storage.service";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  images = [`../assets/topics-img/sm-intro.jpg`, `../assets/topics-img/intro-1.jpg` , `../assets/topics-img/intro-2.jpg`, `../assets/topics-img/intro-3.jpg`, `../assets/topics-img/intro-4.jpg`, `../assets/topics-img/intro-5.jpg`];
  images_loaded;


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

//  ngOnInit() {
  //  this.images_loaded = this.images.slice(0,2);
    //this.carousel.slide.subscribe(()=>{
      //if(this.images_loaded.length < this.images.length) this.images_loaded.push(this.images[this.images_loaded.length]);
      //else this.carousel.slide.complete();}
    //);
  //}

  //next(){
    //this.carousel.next();
  //}

  //prev(){
  //  this.carousel.prev();
  // }
}
