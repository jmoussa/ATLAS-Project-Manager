import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _router: Router) { }
  private _registerUrl = 'http://localhost:3000/api/register';
  private _loginUrl = 'http://localhost:3000/api/login';
  private _verifyUrl = 'http://localhost:3000/api/verify';
  public _response = false;
  // POST request to register
  registerUser(user: any) {
    // TODO check if user.email exists in database
    return this._http.post<any>(this._registerUrl, user);
  }

  // POST reqest to login
  loginUser(user: any) {
    return this._http.post<any>(this._loginUrl, user);
  }

  // Route Guard, CHECKS FOR VALIDITY OF TOKEN (called from component)
  loggedIn() {
    if (!!localStorage.getItem('token')) {
      this.verify()
        .subscribe(
          res => {
            console.log('loggedIn(): Found RETURNING ' + res);
            this._response = res;
            return res;
          });
    } else {
      console.log('loggedIn(): Token NOT Found RETURNING false');
      this._response = false;
      return false;
    }
  }
  verify() {
    return this._http.get<any>(this._verifyUrl);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['']);
    this.loggedIn();
  }

  // Route Guard, CHECKS IF TOKEN IS EXPIRED (called from auth.guard)
  getTokenExpirationDate(token: string): Date {
    let decoded = null;
    try {
      decoded = jwt_decode(token);
    } catch (e) {
      console.log('error while decoding ' + decoded);
      return null;
    }
    if (decoded != null) {
      // console.log('DECODED JWT');
      // console.log(decoded);

      if (decoded.exp === undefined) {
        console.log('decoded date is undefined');
        return null;
      }
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined || date === null) {
      return true;
    }
    return !(date.valueOf() > new Date().valueOf());
  }
}
