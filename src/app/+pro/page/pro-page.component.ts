import {Component, ViewChild} from '@angular/core';
import {Status, Uploader} from '../../services/uploader.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../../services/state.service';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';

@Component({
  selector: 'app-pro',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}), animate(350)
      ]),
      transition(':leave', animate(200, style({opacity: 0})))
    ])
  ]
})

export class ProPageComponent {

  @ViewChild('ngbPopover', {static: true}) ngbPopover: NgbPopover;
  popover: boolean = true;
  eventLoadingTopbar: Subject<void> = new Subject<void>();

  constructor(
    private uploader: Uploader,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }
  ngbPopOverMessage;

  ngOnInit() {
    RestCall.getAccount();
    this.uploader.getOpenFileUploader().onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          this.ngbPopOverMessage = "You exceeded the max size of a single file: 1GB"
          break;
        case 'avoidDuplicates':
          this.ngbPopOverMessage = "Some of these files were already added"
          break;
        case 'onlyAudio':
          this.ngbPopOverMessage = "One or more files are not supported and were not added";
          break;
        case 'checkSizeLimit':
          this.ngbPopOverMessage = "You exceeded the total limit: 2GB";
          break;
        default:
          this.ngbPopOverMessage = "Something went wrong, please try again";
          break;
      }
      this.ngbPopover.open();
    };

    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
      this.ngbPopover.close()
      this.router.navigate(['pro/upload'], {
        skipLocationChange: false
      });
      this.uploader.getOpenSMFileUploader().setStatus(Status.UPLOAD_FORM);
      this.uploader.getOpenSMFileUploader().addTitles(items);
    }
  }

  showUploadPopover() {
    return (this.uploader.isUploading() || this.uploader.isReady()) && this.popover;
  }

  closePopover() {
    this.uploader.clearFileUploaders();
    if (this.uploader.isUploading()) {
      this.eventLoadingTopbar.next();
      this.popover = false;
    }
  }

  openPopover() {
    this.popover = true;
  }
}
