import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Comment} from "../../model/comment";
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
  @Output() newReply = new EventEmitter<Comment>();

  @ViewChild('replytext') replytext;
  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.reply.comment_time = Date.now();
    this.newReply.emit(this.reply);
  }

  focusOnInputDesktop(){
    this.replytext.nativeElement.scrollIntoView({duration: 400, behavior: "smooth", block: "center", inline: "nearest"});
    setTimeout(()=>this.replytext.nativeElement.focus(),400);
  }

  focusOnInputMobile(){
    this.replytext.nativeElement.focus();
  }
}

