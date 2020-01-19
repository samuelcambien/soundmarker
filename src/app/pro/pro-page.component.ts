import {Component} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {User} from "../model/user";

@Component({
  selector: 'app-pro',
  templateUrl: './pro-page.component.html',
  styleUrls: ['./pro-page.component.scss']
})
export class ProPageComponent {

  private currentUser$: Observable<User>;

  constructor(
    private authService: AuthService,
  ) {
    this.currentUser$ = authService.getCurrentUser();
  }

  logout() {
    this.authService.logOut();
  }
}
