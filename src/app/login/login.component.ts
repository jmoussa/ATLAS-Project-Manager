import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginUserData = {};
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this._auth.loggedIn();
  }

  ngAfterViewInit() {
    this._auth.verify()
      .subscribe(
        res => {
          console.log('HOME: LoggedIn?? ' + res);
          if (res === true) {
            this._router.navigate(['/home']);
          }
        }
      );
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          this._auth.verify().subscribe(
            response => {
              if (response !== false) {
                this._router.navigate(['/home']);
                this._auth._response = true;
              }
            },
            error => console.log(error)
          );
        },
        err => console.error(err)
      );
  }

}
