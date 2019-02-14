import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss']
})
export class SplashscreenComponent implements AfterViewInit {

  constructor(private _auth: AuthService, private _dataService: DataService, private _router: Router) {
  }

  ngAfterViewInit () {
    this._auth.verify()
      .subscribe(
        res => {
          console.log('SPLASHSCREEN: LoggedIn? ' + res);
          if ( res === true) {
            this._router.navigate(['/home']);
          } else if (res === false) {
            this._router.navigate(['/login']);
          }
        }
      );
  }

}
