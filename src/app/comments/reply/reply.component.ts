import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../model/comment";
import {Utils} from "../../app.component";

@Component({
  selector: 'reply-lazy',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() reply: Comment;
  @Output() delete = new EventEmitter<Comment>();

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
