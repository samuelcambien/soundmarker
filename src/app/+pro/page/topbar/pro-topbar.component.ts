import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {StateService} from "../../../services/state.service";
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../model/user";

@Component({
  selector: 'app-pro-topbar',
  templateUrl: './pro-topbar.component.html',
  styleUrls: ['./pro-topbar.component.scss']
})
export class ProTopbarComponent {

  private currentUser$: Observable<User>;

  constructor(
    private authService: AuthService,
    private stateService: StateService,
  ) {
    this.currentUser$ = authService.getCurrentUser();
  }

  toggleSidebar() {
    this.stateService.sidebarToggled = !this.stateService.sidebarToggled;
  }

  logout() {
    this.authService.logOut();
  }
}
