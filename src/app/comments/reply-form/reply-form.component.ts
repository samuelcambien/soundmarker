import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../comment";
import {RestUrl, Utils} from "../../app.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.scss']
})
export class ReplyFormComponent implements OnInit {

  @Input() reply;
  @Output() cancel = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.reply.time = Date.now();
    Utils.sendPostRequest(
      RestUrl.COMMENTS,
      JSON.stringify(this.reply)
    );
    form.resetForm();
  }
}
