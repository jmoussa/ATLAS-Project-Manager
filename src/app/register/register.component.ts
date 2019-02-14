import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerUserData = {};
  errorMessage: String;
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
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

  registerUser() {
    this._auth.registerUser(this.registerUserData)
      .subscribe(
        res => {
          console.log('RESPONSE\n');
          console.log(res.message.message);
          if (res.message.message === 'User Exists') {
            console.log('EMAIL EXISTS');
            this.errorMessage = 'Email already exists';
            return false;
          } else {
            localStorage.setItem('token', res.token);
            this._auth.verify().subscribe(
              response => {
                if (response) {
                  this._router.navigate(['/home']);
                  this._auth._response = true;
                }
              },
              error => console.log(error)
            );
            this._router.navigate(['/home']);
          }
        },
        err => console.log(err)
      );
  }

}
