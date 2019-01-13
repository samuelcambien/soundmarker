import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Output() reset = new EventEmitter;

  constructor() {
  }

  ngOnInit() {
  }

  tryAgain(){
    this.reset.emit();
  }
}
