import {Component, EventEmitter, Input, OnInit, Output, Type} from '@angular/core';
import {AboutUsInfoComponent, HelpInfoComponent, ProInfoComponent, PublicInfoComponent} from "../public-info.component";
import {PublicInfoZoneComponent} from "../zone/public-info-zone.component";

@Component({
  selector: 'app-public-info-header',
  template: `
    <div class="header">
      <div class="soundmarker-logo"></div>
      <div class="spacer"></div>
      <app-info-link
        *ngFor="let info of infoComponents"
        [info]="info.apply(info)"
        (onInfoSelected)="infoWasSelected($event)"
      >
      </app-info-link>
    </div>
  `,
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() infoZone: PublicInfoZoneComponent;

  infoComponents: Type<PublicInfoComponent>[] = [
    HelpInfoComponent,
    AboutUsInfoComponent,
    ProInfoComponent
  ];

  public infoWasSelected(info: PublicInfoComponent): void {
    this.infoZone.info = info;
  }

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'app-info-link',
  template: `
    <div (click)="clicked()" class="header-link {{info.title}}">{{info.title}}</div>`,
  styleUrls: ['./public-info-link.component.scss']
})
export class PublicInfoLinkComponent implements OnInit {

  @Input() info: PublicInfoComponent;
  @Output() onInfoSelected: EventEmitter<PublicInfoComponent>;

  constructor() {
    this.onInfoSelected = new EventEmitter<PublicInfoComponent>();
  }

  clicked() {
    this.onInfoSelected.emit(this.info);
  }

  ngOnInit() {
  }
}
