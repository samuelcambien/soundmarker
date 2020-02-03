import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-pro-upload-finished',
  templateUrl: './pro-upload-finished.component.html',
  styleUrls: ['./pro-upload-finished.component.scss']
})
export class ProUploadFinishedComponent implements OnInit {

  @Input() link;
  @Output() sendNewFiles= new EventEmitter();
  @Input() period: string;

  constructor() { }

  ngOnInit() {
  }

  getLink() {
    return "http://localhost:4200/project/" + this.link;
  }

  sendMore(){
    this.sendNewFiles.emit();
  }
}
