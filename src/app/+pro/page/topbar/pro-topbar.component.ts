import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../model/user";
import {ActivatedRoute, Router} from '@angular/router';
import {Uploader} from '../../../services/uploader.service';
import {RestCall} from "../../../rest/rest-call";

@Component({
  selector: 'app-pro-topbar',
  templateUrl: './pro-topbar.component.html',
  styleUrls: ['./pro-topbar.component.scss']
})
export class ProTopbarComponent {

  currentUser$: Observable<User>;
  eventsSubscription: Subscription;
  showUploading = false;
  newComments: {
    title: string,
    hash: string,
    track_id: string,
    version_number: string,
    count: number
  }[];

  @Output() popover = new EventEmitter();
  @Input() upload: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private stateService: StateService,
    protected uploader: Uploader,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentUser$ = authService.getCurrentUser();
  }

  async ngOnInit() {
    this.eventsSubscription = this.upload.subscribe(() => this.showUploading = true);
    this.newComments = await RestCall.getNewComments();
  }

  toggleSidebar() {
    this.stateService.sidebarToggled = !this.stateService.sidebarToggled;
  }

  logout() {
    this.authService.logOut();
  }

  openPopover() {
    this.showUploading = false;
    this.popover.emit();
  }

  newUpload(){
    if(this.uploader.getOpenFileUploader().queue.length == 0)
     document.getElementById("fileinputhiddentop").click();
    else {this.router.navigate(['../pro/upload'], {
      relativeTo: this.activatedRoute,
      skipLocationChange: false
    });}
  }
}
