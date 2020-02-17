import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-pro-upload-popover',
  templateUrl: './pro-upload-popover.component.html',
  styleUrls: ['./pro-upload-popover.component.scss'],

})

export class ProUploadPopoverComponent implements OnInit {

  show: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
