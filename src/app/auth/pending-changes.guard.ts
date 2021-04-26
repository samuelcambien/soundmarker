import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate(): boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate>  {

  constructor(
  ) {
  }

  async canDeactivate(component: ComponentCanDeactivate): Promise<boolean>{
    return component.canDeactivate();
  }
}
