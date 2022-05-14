import { Routes } from '@angular/router';

// import { IndexComponent } from './components/index/index.component';
import { NewRequisitionComponent } from './components/new-requisition/new-requisition.component';
import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { UpdatePricesComponent } from './components/update-prices/update-prices.component';

import { IndexComponent } from './pages/index/index.component';
import { RequisitionPurchasesComponent } from './components/requisition-purchases/requisition-purchases.component';

export const PurchasesRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [
            {
              path: '',
              component: RequisitionPurchasesComponent
            },
          ]
    },
    {
        path: '',
        component: IndexComponent,
    },
    {
        path: 'new',
        component: NewRequisitionComponent,
    },
    {
        path: 'enterInvoice/:id',
        component: NewPurchaseComponent,
    },
    {
        path: 'updatePrices/:id',
        component: UpdatePricesComponent,
    },
];