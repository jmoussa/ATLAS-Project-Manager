import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
import { HttpClient, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  result: any;
  constructor(private _http: HttpClient) { }
  private _getUserUrl = 'http://localhost:3000/api/users';

  private _getProjectsUrl = 'http://localhost:3000/api/projects';
  private _getProjectUrl = 'http://localhost:3000/api/project';
  private _postProjectUrl = 'http://localhost:3000/api/newProject';

  private _getTasksUrl = 'http://localhost:3000/api/tasks';

  getUsers() {
    return this._http.get<any>(this._getUserUrl);
  }

  getProjects(userId: string) {
    let params = new HttpParams();
    params = params.append('id', userId);
    return this._http.get<any>(this._getProjectsUrl, {params: params});
  }

  getProject(projectId: string) {
    let params = new HttpParams();
    params = params.append('id', projectId);
    return this._http.get<any>(this._getProjectUrl, {params: params});
  }

  postProject(project: Object) {
    return this._http.post<any>(this._postProjectUrl, project);
  }

  getTasks(projectId: string, userId: string) {
    let params = new HttpParams();
    params = params.append('projectId', projectId);
    params = params.append('userId', userId);
    return this._http.get<any>(this._getTasksUrl, {params: params});
  }
}
