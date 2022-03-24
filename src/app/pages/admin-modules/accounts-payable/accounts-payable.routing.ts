import { Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { ChequesComponent } from './pages/cheques/cheques.component';
import { DocumentsComponent } from './pages/documents/documents.component';

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
        path: 'cheques',
        component: ChequesComponent
      },
    ]
  }
]
