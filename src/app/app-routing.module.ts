import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { CheckTokenGuard } from './core/auth/check-token.guard';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './pages/layouts/app-layout/app-layout.component';
import { AuthAdminGuard } from './core/auth/auth-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // tslint:disable-next-line: max-line-length
      {
        path: '', loadChildren: () => import('./pages/modules/dashboards/dashboards.module').then(m => m.DashboardsModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'orders', pathMatch: 'full',  loadChildren: () => import('./pages/modules/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'order/:id/:return', pathMatch: 'full',  loadChildren: () => import('./pages/modules/order/order.module').then(m => m.OrderModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'dispatches', pathMatch: 'full',  loadChildren: () => import('./pages/modules/dispatches/dispatches.module').then(m => m.DispatchesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'deliveries', pathMatch: 'full',  loadChildren: () => import('./pages/modules/deliveries/deliveries.module').then(m => m.DeliveriesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'delivery/:id', pathMatch: 'full',  loadChildren: () => import('./pages/modules/delivery/delivery.module').then(m => m.DeliveryModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'customersRoutes', pathMatch: 'full',  loadChildren: () => import('./pages/modules/customers-routes/customers-routes.module').then(m => m.CustomersRoutesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'internalOrders',  loadChildren: () => import('./pages/modules/internal-orders/internal-orders.module').then(m => m.InternalOrdersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'transfers',  loadChildren: () => import('./pages/modules/transfers/transfers.module').then(m => m.TransfersModule),
        canActivate: [CheckTokenGuard]
      },// Aquí comienza Cuentas por cobrar
      {
        path: 'customers', pathMatch: 'full',  loadChildren: () => import('./pages/modules/customers/customers.module').then(m => m.CustomersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'sales', pathMatch: 'full',  loadChildren: () => import('./pages/modules/sales/sales.module').then(m => m.SalesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'receivables', pathMatch: 'full',  loadChildren: () => import('./pages/modules/receivables/receivables.module').then(m => m.ReceivablesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'statements/:id/:return', pathMatch: 'full',  loadChildren: () => import('./pages/modules/statements/statements.module').then(m => m.StatementsModule),
        canActivate: [CheckTokenGuard]
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthAdminGuard],
    children: [
      {
        // tslint:disable-next-line: max-line-length
        path: '', pathMatch: 'full', loadChildren: () => import('./pages/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [CheckTokenGuard]
      },
      {
        // tslint:disable-next-line: max-line-length
        path: 'users', pathMatch: 'full', loadChildren: () => import('./pages/modules/users/users.module').then(m => m.UsersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'orders', pathMatch: 'full',  loadChildren: () => import('./pages/modules/orders-admin/orders-admin.module').then(m => m.OrdersAdminModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'order/:id/:return', pathMatch: 'full',  loadChildren: () => import('./pages/modules/order/order.module').then(m => m.OrderModule),
        canActivate: [CheckTokenGuard]
      },
      // {
      //   // tslint:disable-next-line: max-line-length
      //   path: 'employees', pathMatch: 'full', loadChildren: () => import('./pages/modules/employees/employees.module').then(m => m.EmployeesModule),
      //   canActivate: [CheckTokenGuard]
      // },
      {
        path: 'receivables', pathMatch: 'full',  loadChildren: () => import('./pages/modules/receivables/receivables.module').then(m => m.ReceivablesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'statements/:id/:return', pathMatch: 'full',  loadChildren: () => import('./pages/modules/statements/statements.module').then(m => m.StatementsModule),
        canActivate: [CheckTokenGuard]
      },
    ]
  },
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
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
