import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../../message";

@Component({
  selector: 'app-player-introduction',
  templateUrl: './player-introduction.component.html',
  styleUrls: ['./player-introduction.component.scss']
})
export class PlayerIntroductionComponent implements OnInit {

  @Input() message: Message;
  @Input() sender;
  @Input() expiry_date;

  constructor() { }

  ngOnInit() {
  }

}
