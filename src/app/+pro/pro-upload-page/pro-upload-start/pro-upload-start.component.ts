import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Status, Uploader} from '../../../services/uploader.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-pro-upload-start',
  templateUrl: './pro-upload-start.component.html',
  styleUrls: ['./pro-upload-start.component.scss']
})
export class ProUploadStartComponent implements OnInit {

  @ViewChild('fileinputhidden') fileinput: ElementRef;
  newTrackId;
  ngOnInit(): void {
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
      this.router.navigate(["../upload"],{queryParams: {origin:'dashboard', newTrackId: this.newTrackId}, relativeTo: this.activatedRoute, skipLocationChange:true});
      this.uploader.getOpenSMFileUploader().setStatus(Status.UPLOAD_FORM);
      this.uploader.getOpenSMFileUploader().addTitles(items);
    }

    this.activatedRoute.queryParams.subscribe(queryParam=>
    {if(queryParam.track_id) {
      this.newTrackId = queryParam.track_id;
      this.fileinput.nativeElement.click();
    }
    else{
      this.newTrackId = null;
    }})
  }

  constructor(private uploader: Uploader,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }
}
