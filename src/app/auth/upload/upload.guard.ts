import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UploadGuard implements CanActivate {
  constructor(private router: Router) {}

  allowedOrigins: Array<String> = ['dashboard'];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.checkOrigin(next.queryParams);
  }

  checkOrigin(queryParams): boolean {
    if (queryParams.origin) {
      if(this.allowedOrigins.includes(queryParams.origin)) return true;
    }
    this.router.navigate(['/pro/dashboard']);
    return false;
  }
}
