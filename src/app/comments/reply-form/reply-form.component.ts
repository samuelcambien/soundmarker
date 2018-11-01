import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../model/comment";
import {RestUrl, Utils} from "../../app.component";
import {NgForm} from "@angular/forms";
import {RestCall} from "../../rest/rest-call";

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.scss']
})
export class ReplyFormComponent implements OnInit {

  @Input() reply: Comment;
  @Output() cancel = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.reply.comment_time = Date.now();
    RestCall.addComment(this.reply);
    form.resetForm();
  }
}
