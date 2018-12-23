import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-public-upload-finished',
  templateUrl: './public-upload-finished.component.html',
  styleUrls: ['./public-upload-finished.component.scss']
})
export class PublicUploadFinishedComponent implements OnInit {

  @Input() link;

  constructor() { }

  ngOnInit() {
  }

  getLink() {
    return "http://localhost/project/" + this.link;
  }
}
