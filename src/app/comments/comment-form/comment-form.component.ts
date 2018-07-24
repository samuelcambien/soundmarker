import {Component, OnInit} from '@angular/core';
import {Comment} from "../../comment";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  comment: Comment = new Comment();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.comment.text);
  }
}
