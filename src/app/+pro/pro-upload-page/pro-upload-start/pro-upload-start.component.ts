import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SMFileUploader, Status, Uploader} from '../../../services/uploader.service';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {filter, first, take} from 'rxjs/operators';
import {StateService} from '../../../services/state.service';
import {FileUploader} from "../../../tools/ng2-file-upload";

@Component({
  selector: 'app-pro-upload-start',
  templateUrl: './pro-upload-start.component.html',
  styleUrls: ['./pro-upload-start.component.scss']
})
export class ProUploadStartComponent implements OnInit, OnDestroy {

  @ViewChild('fileinputhiddenstart', {static: true}) fileinput: ElementRef;
  newTrackId;
  subscription;

  ngOnInit(): void {
    this.subscription = this.stateService.getVersionUpload().subscribe(bool => {
      if (bool) {
        this.newTrackId = this.activatedRoute.snapshot.queryParams.track_id;
      }
      else {
        this.newTrackId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private uploader: Uploader,
              private router: Router,
              private stateService: StateService,
              private activatedRoute: ActivatedRoute) {
  }

  getOpenSMFileUploader(): SMFileUploader {
    return this.uploader.getOpenSMFileUploader();
  }

  newUpload(){
    this.stateService.setVersionUpload(false);
    document.getElementById("fileinputhiddenstart").click();
  }
}
