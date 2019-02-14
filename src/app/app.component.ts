import { Component, SimpleChanges, OnChanges, AfterContentInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit, OnChanges {
  loggedIn: Boolean;
  constructor(private _authService: AuthService, private _router: Router) {}

  ngAfterContentInit() {
    this.loggedIn = this._authService.loggedIn();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loggedIn = this._authService.loggedIn();
  }

  logoutUser() {
    this._authService.logoutUser();
    this._authService.loggedIn();
  }
}
