import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SMFileUploader, Uploader} from '../../../services/uploader.service';

@Component({
  selector: 'app-pro-upload-popover',
  templateUrl: './pro-upload-popover.component.html',
  styleUrls: ['./pro-upload-popover.component.scss'],
})

export class ProUploadPopoverComponent implements OnInit {

  @Input() link?;
  @Output() sendNewFiles= new EventEmitter();
  @Input() period?: string;
  @Output() close = new EventEmitter();

  constructor(private uploader: Uploader) { }

  ngOnInit() {
  }

  getProgress(e: SMFileUploader) {
   return e.getFileUploader().progress * 0.99;
  }

  getLink(smFileUploader) {
    return "projects/" + smFileUploader.getProjectHash();
  }

  getFileUploaders() {
    return this.uploader.fileUploaders;
  }

  closePopover() {
    this.close.emit();
  }
}
