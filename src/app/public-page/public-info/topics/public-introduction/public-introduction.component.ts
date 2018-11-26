import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrivacyAndTermsComponent} from "../privacy-and-terms/privacy-and-terms.component";

@Component({
  selector: 'app-public-introduction',
  templateUrl: './public-introduction.component.html',
  styleUrls: ['./public-introduction.component.scss']
})
export class PublicIntroductionComponent implements OnInit {

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  openTerms() {
    this.modalService.open(PrivacyAndTermsComponent);
  }

  accept() {
    localStorage.setItem("soundmarker_accept_terms", "true");
    this.activeModal.close();
  }

  ngOnInit() {
  }

}
