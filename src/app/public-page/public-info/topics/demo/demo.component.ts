import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbCarousel, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  images = [`../assets/topics-img/sm-intro.webp`, `../assets/topics-img/intro-1.webp` , `../assets/topics-img/intro-2.webp`, `../assets/topics-img/intro-3.webp`, `../assets/topics-img/intro-4.webp`, `../assets/topics-img/intro-5.webp`];

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  @ViewChild('carousel') carousel: NgbCarousel;

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
