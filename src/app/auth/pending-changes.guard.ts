import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import {ConfirmDialogService} from '../services/confirmation-dialog/confirmation-dialog.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})

export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate>  {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  constructor(private confirmDialogService: ConfirmDialogService,) {
  }

  async canDeactivate(component: ComponentCanDeactivate): Promise<boolean>{
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see http://stackoverflow.com/a/42207299/7307355
      confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }
}
