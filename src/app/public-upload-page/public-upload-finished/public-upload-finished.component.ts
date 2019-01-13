import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-public-upload-finished',
  templateUrl: './public-upload-finished.component.html',
  styleUrls: ['./public-upload-finished.component.scss']
})
export class PublicUploadFinishedComponent implements OnInit {

  @Input() link;
  @Output() sendNewFiles= new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getLink() {
    return "http://localhost/project/" + this.link;
  }

  private sendMore(){
    this.sendNewFiles.emit();
  }
}
