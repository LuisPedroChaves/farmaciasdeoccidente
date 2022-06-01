import { Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { AdminComponent } from './pages/admin/admin.component';
import { IndependentBoxComponent } from './pages/independent-box/independent-box.component';
import { AccountingBoxComponent } from './pages/accounting-box/accounting-box.component';
import { MyAdminComponent } from './pages/my-admin/my-admin.component';

export const CashBoxesRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        component: AdminComponent
      },
      {
        path: 'myAdmin',
        component: MyAdminComponent
      },
      {
        path: 'independentBox',
        component: IndependentBoxComponent
      },
      {
        path: 'accountingBox',
        component: AccountingBoxComponent
      },
    ]
  }
]
