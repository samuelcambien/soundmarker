import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';

import {AuthService} from './auth.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoggedOutDialogComponent} from '../services/loggedout-dialog/loggedout-dialog.component';
174
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkLogin(state.url);
  }

  canLoad(
    route: Route,
  ): Observable<boolean> {
    return this.checkLogin(`/${route.path}`);
  }

  checkLogin(url: string): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map(currentUser => {
        if (currentUser != null) {
          return true;
        }
        this.modalService.open(LoggedOutDialogComponent,{backdrop  : 'static',
          keyboard  : false});
        return true;
      }),
    );
  }
}
