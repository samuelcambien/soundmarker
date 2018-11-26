import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-privacy-and-terms',
  templateUrl: './privacy-and-terms.component.html',
  styleUrls: ['./privacy-and-terms.component.scss']
})
export class PrivacyAndTermsComponent implements OnInit {

  activePage: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.activePage = "terms";
  }

  close() {
    this.activeModal.close();
  }
}
