import {Component, EventEmitter, Input, OnInit, Output, Type} from '@angular/core';
import {AboutUsInfoComponent, HelpInfoComponent, ProInfoComponent, PublicInfoComponent} from "../public-info.component";
import {PublicInfoZoneComponent} from "../zone/public-info-zone.component";

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() infoZone: PublicInfoZoneComponent;

  help: Type<PublicInfoComponent> = HelpInfoComponent;
  aboutUs: Type<PublicInfoComponent> = AboutUsInfoComponent;
  pro: Type<PublicInfoComponent> = ProInfoComponent;

  public infoWasSelected(info: Type<PublicInfoComponent>): void {
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
    <a (click)="onInfoSelected.emit(info);" class="nav-link {{info.title.toLowerCase()}}">{{info.title}}</a>
  `,
  styleUrls: ['./public-info-link.component.scss']
})
export class PublicInfoLinkComponent implements OnInit {

  @Input() info: PublicInfoComponent;
  @Input() infoZone: PublicInfoZoneComponent;
  @Output() onInfoSelected: EventEmitter<PublicInfoComponent>;

  constructor() {
    this.onInfoSelected = new EventEmitter<PublicInfoComponent>();
  }

  ngOnInit() {
  }
}
