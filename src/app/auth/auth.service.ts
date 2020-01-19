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

  private currentUser: BehaviorSubject<User>;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
  ) {
    this.currentUser = new BehaviorSubject<User>(this.localStorage.getCurrentUser());
    // this.getCurrentUser().subscribe(currentUser => {
    //   if (!currentUser) this.logOut();
    // });
  }

  redirect: string = 'pro';

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable().pipe(
      map(currentUser => {
        if (currentUser && currentUser.isValid()) {
          return currentUser;
        } else {
          return null;
        }
      }),
    );
  }

  authenticate(email: string, password: string): void {
    RestCall.authenticate(email, password).then(async response => {
      if (password === 'iedemenne') {
        this.setCurrentUser(new User(new Date(Date.now() + 555555555555), "Bearer iedemenne", email));
        await this.router.navigate([this.redirect]);
      }
    });
  }

  async logOut() {
    await this.router.navigate(['']);
    this.setCurrentUser(null);
  }

  private setCurrentUser(user) {
    this.localStorage.storeCurrentUser(user);
    this.currentUser.next(user);
  }
}
