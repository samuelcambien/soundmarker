import {Injectable, OnInit} from '@angular/core';
import {Endpoints, Request} from "../rest/rest-call";
import {Router} from "@angular/router";
import {LocalStorageService} from "../services/local-storage.service";
import {User} from "../model/user";
import {BehaviorSubject, Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {

  isAdmin: boolean= false;
  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {

  }

  redirect: string = 'pro';

  getCurrentUser(): Observable<User> {
    return this.currentUser.pipe(
      tap(async (currentUser) => {
        if (!currentUser) {
          const newVar = await Request.getNonCaching(Endpoints.USER);
          const email = newVar['user_info']['user_email'];
          this.setCurrentUser(new User(email));
        }
      }),
    );
  }

  async logOut(){
    this.setCurrentUser(null);
  }

  private setCurrentUser(user) {
    this.localStorage.storeCurrentUser(user);
    this.currentUser.next(user);
  }

  async ngOnInit(): Promise<void> {
  }
}
