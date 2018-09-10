import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../comment";

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

}
