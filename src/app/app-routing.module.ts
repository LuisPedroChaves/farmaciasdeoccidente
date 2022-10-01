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
        path: '',
        loadChildren: () =>
          import('./pages/modules/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'quotes', loadChildren: () => import('./pages/modules/quotes/quotes.module').then(m => m.QuotesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'orders', pathMatch: 'full',  loadChildren: () => import('./pages/modules/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'order/:id/:return',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/order/order.module').then(
            (m) => m.OrderModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'dispatches',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/dispatches/dispatches.module').then(
            (m) => m.DispatchesModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'deliveries',
        loadChildren: () =>
          import('./pages/modules/deliveries/deliveries.module').then(
            (m) => m.DeliveriesModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'customersRoutes',
        pathMatch: 'full',
        loadChildren: () =>
          import(
            './pages/modules/customers-routes/customers-routes.module'
          ).then((m) => m.CustomersRoutesModule),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'internalOrders',
        loadChildren: () =>
          import('./pages/modules/internal-orders/internal-orders.module').then(
            (m) => m.InternalOrdersModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'transfers',
        loadChildren: () =>
          import('./pages/modules/transfers/transfers.module').then(
            (m) => m.TransfersModule
          ),
        canActivate: [CheckTokenGuard],
      }, // Aquí comienza Cuentas por cobrar
      {
        path: 'customers',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/customers/customers.module').then(
            (m) => m.CustomersModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'sales',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/sales/sales.module').then(
            (m) => m.SalesModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'checkStock',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/check-stock/check-stock.module').then(
            (m) => m.CheckStockModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'storage',
        loadChildren: () =>
          import('./pages/modules/storage/storage.module').then(
            (m) => m.StorageModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'tempStorage',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/temp-storage/temp-storage.module').then(
            (m) => m.TempStorageModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'pharmaStatistics', pathMatch: 'full',  loadChildren: () => import('./pages/modules/statistics/statistics.module').then(m => m.StatisticsModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'purchases', loadChildren: () => import('./pages/modules/purchases/purchases.module').then(m => m.PurchasesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'requests', loadChildren: () => import('./pages/modules/requests/requests.module').then(m => m.RequestsModule),
        canActivate: [CheckTokenGuard]
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthAdminGuard],
    children: [
      {
        // tslint:disable-next-line: max-line-length
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        // tslint:disable-next-line: max-line-length
        path: 'users',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/users/users.module').then(
            (m) => m.UsersModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./pages/admin-modules/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'adminProducts',
        loadChildren: () =>
          import('./pages/admin-modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'adminDeliveries',
        loadChildren: () =>
          import('./pages/admin-modules/deliveries/deliveries.module').then(
            (m) => m.DeliveriesModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'adminOrders',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/orders/orders.module').then(
            (m) => m.OrdersModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'order/:id/:return',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/modules/order/order.module').then(
            (m) => m.OrderModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        // tslint:disable-next-line: max-line-length
        path: 'employees', pathMatch:
      'full', loadChildren: () => import('./pages/admin-modules/employees/employees.module').then(m => m.EmployeesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'payroll', pathMatch:
      'full', loadChildren: () => import('./pages/admin-modules/payroll/payroll.module').then(m => m.PayrollModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'employee-transactions', pathMatch:
      'full', loadChildren: () => import('./pages/admin-modules/employee-transactions/employee-transactions.module').then(m => m.EmployeeTransactionsModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'receivables',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/receivables/receivables.module').then(
            (m) => m.ReceivablesModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'accountsPayable', loadChildren: () => import('./pages/admin-modules/accounts-payable/accounts-payable.module').then(m => m.AccountsPayableModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'cash', loadChildren: () => import('./pages/admin-modules/cash-boxes/cash-boxes.module').then(m => m.CashBoxesModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'statements/:id/:return', pathMatch: 'full',  loadChildren: () => import('./pages/admin-modules/statements/statements.module').then(m => m.StatementsModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'brands', pathMatch: 'full',  loadChildren: () => import('./pages/admin-modules/brands/brands.module').then(m => m.BrandsModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'providers', pathMatch: 'full',  loadChildren: () => import('./pages/admin-modules/providers/providers.module').then(m => m.ProvidersModule),
        canActivate: [CheckTokenGuard]
      },
      {
        path: 'uploads',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/uploads/uploads.module').then(
            (m) => m.UploadsModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'statistics',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/statistics/statistics.module').then(
            (m) => m.StatisticsModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'tempStatistics',
        pathMatch: 'full',
        loadChildren: () =>
          import(
            './pages/admin-modules/temp-statistics/temp-statistics.module'
          ).then((m) => m.TempStatisticsModule),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'adminCheckStock',
        pathMatch: 'full',
        loadChildren: () =>
          import('./pages/admin-modules/check-stock/check-stock.module').then(
            (m) => m.CheckStockModule
          ),
        canActivate: [CheckTokenGuard],
      },
      {
        path: 'adminSellersReport', pathMatch: 'full',  loadChildren: () => import('./pages/admin-modules/seller-report/seller-report.module').then(m => m.SellerReportModule),
        canActivate: [CheckTokenGuard]
      },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'session',
        loadChildren: () =>
          import('./pages/modules/session/session.module').then(
            (m) => m.SessionModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'session/not-found',
  },
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, {
  relativeLinkResolution: 'legacy',
});

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
