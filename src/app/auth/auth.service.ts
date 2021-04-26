import {Injectable} from '@angular/core';
import {RestCall} from "../rest/rest-call";
import {Router} from "@angular/router";
import {LocalStorageService} from "../services/local-storage.service";
import {User} from "../model/user";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  private currentUser: Observable<User>;
  isAdmin: boolean= false;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(this.localStorage.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
    // );
    // this.getCurrentUser().subscribe(currentUser => {
    //   if (!currentUser) this.logOut();
    // });
  }

  redirect: string = 'pro';

  getCurrentUser(): Observable<User> {
    return this.currentUser.pipe(
      map(currentUser => {
        if (currentUser && currentUser.isValid()) {
          return currentUser;
        } else {
          return null
        }
      }),
    );
  }

  async logOut(){
    this.setCurrentUser(null);
  }

  private setCurrentUser(user) {
    this.localStorage.storeCurrentUser(user);
    this.currentUserSubject.next(user);
  }
}
