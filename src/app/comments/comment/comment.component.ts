import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Comment} from "../../comment";
import {ReplyFormComponent} from "../reply-form/reply-form.component";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;

  @ViewChild('reply', { read: ViewContainerRef }) reply: ViewContainerRef;

  showReplies: boolean = false;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {
  }

  showReplyForm() {
    this.reply.clear();
    this.reply.createComponent(
      this.cfr.resolveComponentFactory(
        ReplyFormComponent
      )
    ).instance.parentId = this.comment.id;
  }
}
