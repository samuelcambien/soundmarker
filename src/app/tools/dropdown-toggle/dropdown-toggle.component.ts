import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dropdown-toggle',
  templateUrl: './dropdown-toggle.component.html',
  styleUrls: ['./dropdown-toggle.component.scss']
})
export class DropdownToggleComponent implements OnInit {

  @ViewChild('toggle', {static: false}) toggle: ElementRef;

  constructor() { }

  ngOnInit() {
  }
}
