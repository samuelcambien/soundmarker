import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../model/user";
import {ActivatedRoute, Router} from '@angular/router';
import {Uploader} from '../../../services/uploader.service';
import {RestCall} from "../../../rest/rest-call";
import {ConfirmDialogService} from '../../../services/confirmation-dialog/confirmation-dialog.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pro-topbar',
  templateUrl: './pro-topbar.component.html',
  styleUrls: ['./pro-topbar.component.scss'],
})
export class ProTopbarComponent {

  currentUser$: Observable<User>;
  newComments: {
    title: string,
    hash: string,
    track_id: string,
    version_number: string,
    count: number
  }[] = [];

  @Input() upload: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private stateService: StateService,
    protected uploader: Uploader,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private modalService: NgbModal
  ) {
    this.currentUser$ = authService.getCurrentUser();
  }

  async ngOnInit() {
    this.newComments = await RestCall.getNewComments();
  }

  toggleSidebar() {
    this.stateService.sidebarToggled = !this.stateService.sidebarToggled;
  }

  logout() {
    this.authService.logOut();
  }


  async newUpload(){
    if(this.uploader.getOpenFileUploader().queue.length != 0){
      if (await this.confirmDialogService.confirm('Do you want to continue your file uploading or start a new one ', 'Start new one', 'Proceed old one')) {
        this.uploader.getOpenSMFileUploader().resetSMFileUploader();
        this.stateService.setVersionUpload(false);
        document.getElementById("fileinputhiddentop").click();}
      else {this.router.navigate(['../pro/upload'], {
        relativeTo: this.activatedRoute,
        skipLocationChange: false});
      }
    }
    else{
        this.stateService.setVersionUpload(false);
        document.getElementById("fileinputhiddentop").click();}
  }

  openModal(modal) {
    this.modalService.open(modal);
  }
}
