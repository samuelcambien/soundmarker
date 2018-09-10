import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../comment";
import {RestUrl, Utils} from "../../app.component";
import {FormControl, FormGroup, NgForm} from "@angular/forms";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {

  commentForm = new FormGroup({
    text: new FormControl('Type comment')
  });

  @Input() version_id;
  @Input() comment: Comment;
  @Input() player: any;

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.comment.time = Date.now();
    this.comment.version_id = this.version_id;
    Utils.sendPostRequest(
      RestUrl.COMMENTS,
      JSON.stringify(this.comment)
    );
    form.resetForm();
  }

  format(seconds) {
    // return Utils.getTimeFormatted(seconds);
  }

  triggerStart() {
    if (!this.comment.start)
      this.comment.start = this.player.backend.getCurrentTime();
  }

  triggerEnd() {
    if (!this.comment.end)
      this.comment.end = this.player.backend.getDuration();
  }

  onFormSubmit() {

  }
}
