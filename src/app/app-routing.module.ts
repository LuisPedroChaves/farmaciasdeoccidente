import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './pages/layouts/app-layout/app-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      // tslint:disable-next-line: max-line-length
      {
        path: '', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        // canActivate: [CheckTokenGuard]
      },
      {
        path: 'customers', pathMatch: 'full',  loadChildren: () => import('./pages/modules/customers/customers.module').then(m => m.CustomersModule),
        // canActivate: [CheckTokenGuard]
      },
      {
        path: 'customersRoutes', pathMatch: 'full',  loadChildren: () => import('./pages/modules/customers-routes/customers-routes.module').then(m => m.CustomersRoutesModule),
        // canActivate: [CheckTokenGuard]
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AuthAdminGuard],
    children: [
      {
        // tslint:disable-next-line: max-line-length
        path: '', pathMatch: 'full', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        // canActivate: [CheckTokenGuard]
      },
      {
        // tslint:disable-next-line: max-line-length
        path: 'users', pathMatch: 'full', loadChildren: () => import('./pages/modules/users/users.module').then(m => m.UsersModule),
        // canActivate: [CheckTokenGuard]
      },
      {
        // tslint:disable-next-line: max-line-length
        path: 'employees', pathMatch: 'full', loadChildren: () => import('./pages/modules/employees/employees.module').then(m => m.EmployeesModule),
        // canActivate: [CheckTokenGuard]
      },
    ]
  },
  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   children: [
  //     { path: 'session', loadChildren: () => import('./pages/modules/session/session.module').then(m => m.SessionModule) }
  //   ]
  // },
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
