import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewversionGuard implements CanActivate {
  constructor(private router: Router) {}
  allowedOrigins: Array<String> = ['newversion'];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.checkOrigin(next.queryParams);
  }

  checkOrigin(queryParams): boolean {
    console.log(queryParams.origin);
    if (queryParams.origin) {
      if(this.allowedOrigins.includes(queryParams.origin)) return true;
    }
    this.router.navigate(['/pro/dashboard']);
    return false;
  }
}
