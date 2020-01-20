import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbCarousel, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, Observable, fromEvent, Subject} from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  @ViewChild('carousel') carousel: NgbCarousel;
  images = [`../assets/topics-img/sm-intro.webp`, `../assets/topics-img/intro-1.webp` , `../assets/topics-img/intro-2.webp`, `../assets/topics-img/intro-3.webp`, `../assets/topics-img/intro-4.webp`, `../assets/topics-img/intro-5.webp`];
  images_loaded;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.images_loaded = this.images.slice(0,3);
    this.carousel.slide.subscribe(()=>{
      if(this.images_loaded.length < this.images.length) this.images_loaded.push(this.images[this.images_loaded.length]);
      else this.carousel.slide.complete();}
      );
  }

  close() {
    this.activeModal.close();
  }

  next(){
    this.carousel.next();
  }

  prev(){
    this.carousel.prev();
  }
}
