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
174
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {
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

        // Store the attempted URL for redirecting
        this.authService.redirect = url;

        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
      }),
    );
  }
}
