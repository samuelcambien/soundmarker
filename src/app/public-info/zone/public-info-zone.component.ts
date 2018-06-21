import {Component, OnInit, Type} from '@angular/core';
import {PublicInfoComponent} from "../public-info.component";

@Component({
  selector: 'app-public-info-zone',
  template: `
    <ng-container *ngComponentOutlet="info"></ng-container>
  `,
  styleUrls: ['./public-info-zone.component.scss']
})
export class PublicInfoZoneComponent implements OnInit {

  info: Type<PublicInfoComponent>;

  constructor() { }

  ngOnInit() {
  }
}
