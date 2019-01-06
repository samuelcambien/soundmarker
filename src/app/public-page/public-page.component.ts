import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../message";
import {RestCall} from "../rest/rest-call";

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  @Input() message: Message;
  @Input() error;

  ad;

  constructor() { }

  ngOnInit() {
    RestCall.getAdId()
      .then(response => RestCall.getAd(response["ad_id"]))
      .then(response => this.ad = response);
  }
}
