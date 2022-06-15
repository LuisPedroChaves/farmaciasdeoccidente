import { Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { ChequesComponent } from './pages/cheques/cheques.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { CheckDeliveriesComponent } from './pages/check-deliveries/check-deliveries.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { BanksComponent } from './pages/banks/banks.component';
import { CashRequisitionsComponent } from './pages/cash-requisitions/cash-requisitions.component';

export const AccountsPayableRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        component: ProvidersComponent
      },
      {
        path: 'documents',
        component: DocumentsComponent
      },
      {
        path: 'cashRequisitions',
        component: CashRequisitionsComponent
      },
      {
        path: 'banks',
        component: BanksComponent
      },
      {
        path: 'cheques',
        component: ChequesComponent
      },
      {
        path: 'checkDeliveries',
        component: CheckDeliveriesComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
    ]
  }
]
