import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommentSorter} from "../model/comment";
import {ActivatedRoute} from "@angular/router";
import {RestUrl, Utils} from "../app.component";

@Component({
  selector: 'app-soundmarker',
  templateUrl: './soundmarker.component.html',
  styleUrls: ['./soundmarker.component.scss']
})
export class SoundmarkerComponent implements OnInit {

  @ViewChild('marker') marker: ElementRef;

  @Input() comment: Comment;

  @Input() player;

  startPos;

  private duration: any;

  private playerWidth;

  ngOnInit() {
  }

  validateDragStart() {
    // return (coords) =>
    // this.getCommentTime(this.startTime, coords) > 0 &&
    // (this.getCommentTime(this.startTime, coords) < this.comment.end_time || !this.comment.include_end) &&
    // this.getCommentTime(this.startTime, coords) <= this.duration;
  }

  validateDragEnd() {
    // return (coords) =>
    // this.getCommentTime(this.endTime, coords) > 0 &&
    // (this.getCommentTime(this.endTime, coords) > this.comment.start_time || !this.comment.start_time) &&
    // this.getCommentTime(this.endTime, coords) <= this.duration;
  }

  private getPosition(element, commentTime) {
    return this.playerWidth && this.duration ?
      this.playerWidth * commentTime / this.duration - element.nativeElement.offsetWidth / 2 + "px" :
      -element.nativeElement.offsetWidth / 2 + "px";
  }

  private getCommentTime(element, startPos, event) {

    return this.duration * (startPos + event + element.nativeElement.offsetWidth / 2) / this.playerWidth;
  }
}
