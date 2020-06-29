import {Component} from '@angular/core';
import {Status, Uploader} from '../../services/uploader.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-pro',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}),animate(350)
      ]),
      transition(':leave',animate(200, style({opacity: 0})))
    ])
  ]
})

export class ProPageComponent {

  popover: boolean = true;
  eventLoadingTopbar: Subject<void> = new Subject<void>();

  constructor(private uploader: Uploader){
  }

  showPopover(){
    return this.popover;
  }

  closePopover(){
    this.uploader.clearFileUploaders();
    if (this.uploader.isUploading()) {
      this.eventLoadingTopbar.next();
      this.popover = false;
    }
  }

  openPopover(){
    this.popover = true;
  }
}
