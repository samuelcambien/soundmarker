import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../../comment";
import {RestUrl, Utils} from "../../app.component";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Input() version_id;
  comment: Comment = new Comment();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.comment.time = Date.now();
    this.comment.version_id = this.version_id;
    Utils.sendPostRequest(
      RestUrl.COMMENTS,
      JSON.stringify(this.comment)
    );
  }
}
