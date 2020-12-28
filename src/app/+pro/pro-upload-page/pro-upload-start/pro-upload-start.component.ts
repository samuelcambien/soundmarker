import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Status, Uploader} from '../../../services/uploader.service';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {filter, first, take} from 'rxjs/operators';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-pro-upload-start',
  templateUrl: './pro-upload-start.component.html',
  styleUrls: ['./pro-upload-start.component.scss']
})
export class ProUploadStartComponent implements OnInit, OnDestroy {

  @ViewChild('fileinputhidden', {static: true}) fileinput: ElementRef;
  newTrackId;
  subscription;

  ngOnInit(): void {
    this.subscription = this.stateService.getVersionUpload().subscribe(bool => {
        if (bool) {
          this.fileinput.nativeElement.click();
          this.newTrackId = this.activatedRoute.snapshot.queryParams.track_id;
        }
        else{
          this.newTrackId = null;
        }
      });
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  constructor(private uploader: Uploader,
              private router: Router,
              private stateService: StateService,
              private activatedRoute: ActivatedRoute) {

    this.uploader.getOpenFileUploader().onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          message = "You exceeded the limit of 2 GB."
          break;
        case 'onlyAudio':
          message = "One or more files are not supported and were not added.";
          break;
        case 'checkSizeLimit':
          message = "You exceeded the limit of 2 GB.";
          break;
        default:
          message = "Something went wrong, please try again.";
          break;
      }
    };
    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
      this.stateService.playerToggled = false;
      this.router.navigate(['../upload'], {
        queryParams: {origin: 'dashboard', newTrackId: this.newTrackId},
        relativeTo: this.activatedRoute,
        skipLocationChange: true
      });
      this.uploader.getOpenSMFileUploader().setStatus(Status.UPLOAD_FORM);
      this.uploader.getOpenSMFileUploader().addTitles(items);
    }
  }
}
