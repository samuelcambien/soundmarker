import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss']
})
export class PlayButtonComponent implements OnInit {

  @Input() disabled: boolean;
  @Input() size;
  @Input() state: State;

  @Output() clicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
}

export enum State {

  loading = "loading",
  play = "play",
  pause = "pause",
  stop = "stop"
}
