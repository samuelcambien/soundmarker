import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../message";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-public-info-header',
  templateUrl: './public-info-header.component.html',
  styleUrls: ['./public-info-header.component.scss']
})
export class PublicInfoHeaderComponent implements OnInit {

  @Input() messages: Message[];

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  goToPage() {
    window.history.replaceState({}, '',`/uploading-files-dev`);
  }
}
