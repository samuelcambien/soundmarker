import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {StateService} from "../../../services/state.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../model/user";
import {Uploader} from '../../../services/uploader.service';

@Component({
  selector: 'app-pro-topbar',
  templateUrl: './pro-topbar.component.html',
  styleUrls: ['./pro-topbar.component.scss']
})
export class ProTopbarComponent {

  currentUser$: Observable<User>;
  eventsSubscription: Subscription;
  showUploading= false;

  @Output() popover = new EventEmitter();
  @Input() upload: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private stateService: StateService,
  ) {
    this.currentUser$ = authService.getCurrentUser();
  }

  ngOnInit(){
    this.eventsSubscription = this.upload.subscribe(() => this.showUploading = true);
  }

  toggleSidebar() {
    this.stateService.sidebarToggled = !this.stateService.sidebarToggled;
  }

  logout() {
    this.authService.logOut();
  }

  openPopover(){
    this.showUploading = false;
    this.popover.emit();
  }
}
