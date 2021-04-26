import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Status, Uploader} from '../../services/uploader.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {StateService} from '../../services/state.service';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';
import {throttleTime} from 'rxjs/operators';

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

  successMessage = '';
  warnings = [];
  @ViewChild('ngbPopover', {static: true}) ngbPopover: NgbPopover;
  popover: boolean = true;
  eventLoadingTopbar: Subject<void> = new Subject<void>();
  ngbPopOverMessage;
  warnings_timers = new Array<number>();

  constructor(
    private uploader: Uploader,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stateService: StateService
  ) {

  }

  ngOnInit() {
    this.stateService.getAlert().pipe(throttleTime(5000)).subscribe(message =>{
      console.log('lalaa');
      if(message){
        this.warnings.unshift(message);
        let newTimer = setTimeout(() => this.warnings.splice(-1,1) ,10000);
        this.warnings_timers.unshift(newTimer);
      }
    });
    RestCall.getAccount();
    this.uploader.getOpenFileUploader().onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          this.ngbPopOverMessage = "You exceeded the max size of a single file: 1GB"
          this.stateService.setAlert(this.ngbPopOverMessage);
          break;
        case 'avoidDuplicates':
          this.ngbPopOverMessage = "Some of these files were already added"
          this.stateService.setAlert(this.ngbPopOverMessage);
          break;
        case 'onlyAudio':
          this.ngbPopOverMessage = "One or more files are not supported and were not added";
          this.stateService.setAlert(this.ngbPopOverMessage);
          break;
        case 'checkSizeLimit':
          this.ngbPopOverMessage = "You exceeded the total limit: 2GB";
          this.stateService.setAlert(this.ngbPopOverMessage);
          break;
        default:
          this.ngbPopOverMessage = "Something went wrong, please try again";
          this.stateService.setAlert(this.ngbPopOverMessage);
          break;
      }


    };

    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
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

  closeUploadPopover() {
    this.uploader.clearFileUploaders();
    if (this.uploader.isUploading()) {
      this.popover = false;
    }
  }

  public closeAlert(index){
    this.warnings.splice(index, 1);
    clearTimeout(this.warnings_timers[index]);
    this.warnings_timers.splice(index, 1);
  }
}
