import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../../model/comment";
import {Utils} from "../../app.component";

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() reply: Comment;

  constructor() { }

  ngOnInit() {
  }

  getTimeHumanized(time: number) {
    return Utils.getTimeHumanized(time);
  }

  getTimeAccurate(time: number) {
    return Utils.getTimeAccurate(time);
  }
}
