import { Component, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  projects: Array<any>;
  newProject = {};
  userId: string;
  statuses = ['Queue', 'In Progress', 'Completed'];
  constructor(private _auth: AuthService, private _dataService: DataService, private _router: Router) {}

  ngAfterViewInit() {
    this._auth.verify()
      .subscribe(
        res => {
          console.log('HOME: LoggedIn?? ' + res.userId);
          if (res === false) {
            this._router.navigate(['/login']);
          } else {
            this.userId = res.userId;
            this._dataService.getProjects(this.userId).subscribe(
              (data: any) => {
                this.projects = data;
                for (const i of this.projects) {
                  let d = new Date(i.startDate);
                  i.startDate = d.toDateString();
                  d = new Date(i.endDate);
                  i.endDate = d.toDateString();
                }
              },
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
      );
  }

  saveProject() {
    console.log('PROJECT');
    // Add this user as able to open
    this.newProject['openTo'] = [];
    this.newProject['openTo'].push(this.userId);

    console.log(this.newProject);
    this._dataService.postProject(this.newProject).subscribe(
      res => {
        if (res !== false) {
          this._dataService.getProjects(this.userId).subscribe(
            (data: any) => {
              this.projects = data;
              for (const i of this.projects) {
                let d = new Date(i.startDate);
                i.startDate = d.toDateString();
                d = new Date(i.endDate);
                i.endDate = d.toDateString();
              }
            },
            err => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401 ) {
                  this._router.navigate(['/login']);
                }
              }
            });
        } else {
          console.error(res);
        }
      },
      err => console.error(err)
    );
  }
}
