import {Injectable, OnInit} from '@angular/core';
import {Endpoints, Request} from '../rest/rest-call';
import {Router} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';
import {User} from '../model/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {

  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  redirect: string = 'pro';

  getCurrentUser(): Observable<User> {
    return this.currentUser.pipe(
      tap(async (currentUser) => {
        if (!currentUser) {
          let userResponse = await Request.getNonCaching(Endpoints.USER);
          this.setCurrentUser(new User(userResponse['user_email'], userResponse['display_name']));
        }
      }),
    );
  }

  async logOut(){
    this.setCurrentUser(null);
  }

  private setCurrentUser(user) {
    this.currentUser.next(user);
  }

  async ngOnInit(): Promise<void> {
  }
}
