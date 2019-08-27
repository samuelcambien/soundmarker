import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "../../../../services/local-storage.service";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private termsAcceptedService: LocalStorageService) { }

  accept() {
    this.termsAcceptedService.acceptTerms(new Date());
    this.activeModal.close();
  }

  ngOnInit() {
  }
}
