import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrivacyAndTermsComponent} from "../privacy-and-terms/privacy-and-terms.component";
import {LocalStorageService} from "../../../../local-storage.service";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private termsAcceptedService: LocalStorageService) { }

  openTerms() {
    this.modalService.open(PrivacyAndTermsComponent);
  }

  accept() {
    this.termsAcceptedService.acceptTerms(new Date());
    this.activeModal.close();
  }

  ngOnInit() {
  }

}
