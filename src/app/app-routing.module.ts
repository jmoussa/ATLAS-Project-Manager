import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { GanttchartscreenComponent } from './ganttchartscreen/ganttchartscreen.component';
import { ProjectscreenComponent } from './projectscreen/projectscreen.component';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/h',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gantt/:id',  // Gantt Chart Id
    component: GanttchartscreenComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projectscreen/:id',  // Project Id
    component: ProjectscreenComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'h',
    component: SplashscreenComponent,
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
