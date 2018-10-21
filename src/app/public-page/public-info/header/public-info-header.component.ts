import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../message";

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() messages: Message[];

  constructor() {
  }

  ngOnInit() {
  }
}
