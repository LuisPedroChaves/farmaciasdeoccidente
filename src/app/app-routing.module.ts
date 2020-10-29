import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './pages/layouts/app-layout/app-layout.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   // canActivate: [AuthGuard],
  //   children: [
  //     // tslint:disable-next-line: max-line-length
  //     {
  //       // path: '', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  //       // canActivate: [CheckTokenGuard]
  //     },
  //   ]
  // },
  // {
  //   path: 'admin',
  //   component: AdminLayoutComponent,
  //   // canActivate: [AuthAdminGuard],
  //   children: [
  //     {
  //       // path: '', pathMatch: 'full', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  //       // canActivate: [CheckTokenGuard]
  //     },
  //   ]
  // },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'session', loadChildren: () => import('./pages/modules/session/session.module').then(m => m.SessionModule) }
    ]
  },
  {
    path: '**',
    redirectTo: 'session/not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
