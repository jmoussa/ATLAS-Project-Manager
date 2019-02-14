import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users: Array<any>;

  constructor(private _dataService: DataService, private _router: Router) {
    this._dataService.getUsers()
      .subscribe(
        (data: any) => this.users = data,
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 ) {
              this._router.navigate(['/login']);
            }
          }
        }
      );
  }
}
