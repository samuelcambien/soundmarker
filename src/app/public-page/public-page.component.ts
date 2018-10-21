import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../message";

@Component({
  selector: 'app-public-page',
  templateUrl: './public-page.component.html',
  styleUrls: ['./public-page.component.scss']
})
export class PublicPageComponent implements OnInit {

  @Input() messages: Message[];

  constructor() { }

  ngOnInit() {
  }

}
