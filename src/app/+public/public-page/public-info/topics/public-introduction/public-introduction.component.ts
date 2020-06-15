import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbCarousel, NgbCarouselConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from "../../../../../services/local-storage.service";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  @Output() acceptTerms = new EventEmitter<any>();

  constructor(private activeModal: NgbActiveModal, private termsAcceptedService: LocalStorageService) {
  }

  accept() {
    this.termsAcceptedService.acceptTerms(new Date());
    this.acceptTerms.emit("accept");
  }

  ngOnInit() {
  }
}
