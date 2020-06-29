import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string;
  password: string;

  constructor(
    private authService: AuthService,
  ) { }

  onSubmit() {
    this.authService.authenticate(this.email, this.password);
  }
}
