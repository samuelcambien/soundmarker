import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pro-popover',
  templateUrl: './pro-popover.component.html',
  styleUrls: ['./pro-popover.component.scss']
})
export class ProPopoverComponent implements OnInit {

  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  closePopover() {
    this.close.emit();
  }
}
