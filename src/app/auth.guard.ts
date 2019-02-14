import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService,
              private _router: Router) { }

  // WILL ONLY CHECK FOR TIMESTAMP, NOT VALIDITY
  // CHECK FOR VALIDITY AfterViewInit in component.ts
  canActivate(): boolean {
    console.log('AUTHGUARD: CHECKING');
    const token = localStorage.getItem('token');
    if (!this._auth.isTokenExpired(token)) {
      console.log('AUTHGUARD: TOKEN SUCCESS');
      return true;
    } else {
      console.log('AUTHGUARD: TOKEN FAIL');
      this._router.navigate(['/login']);
      return false;
    }
  }
}
