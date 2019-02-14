import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-projectscreen',
  templateUrl: './projectscreen.component.html',
  styleUrls: ['./projectscreen.component.scss']
})
export class ProjectscreenComponent implements OnInit {

  projectId: string;
  userId: string;
  currentProject: Object;
  taskList = [];

  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _dataService: DataService) { }

  ngOnInit() {
   // Need to verify first
    this._auth.verify().subscribe(
      res => {
        if (res === false) {
          this._router.navigate(['/login']);
        } else {
          this.userId = res.userId;
          this._activatedRoute.paramMap.subscribe(params => {
            this.projectId = params.get('id');
            this._dataService.getProject(this.projectId).subscribe(
              project => {
                // console.log('Project Returned');
                // console.log(project);
                this.currentProject = project[0];
                this._dataService.getTasks(this.projectId, this.userId).subscribe(
                  taskList => {
                    this.taskList = taskList;
                    console.log('TASKLIST');
                    console.log(this.taskList);
                  }
                );
              });
          });
        }
      }
    );
  }

  saveProject() {

  }

}
