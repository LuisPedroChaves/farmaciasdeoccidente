import { Routes } from '@angular/router';

import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { IndexComponent } from './components/index/index.component';
import { UpdatePricesComponent } from './components/update-prices/update-prices.component';

export const PurchasesRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
    },
    {
        path: 'new',
        component: NewPurchaseComponent,
    },
    {
        path: 'updatePrices/:id',
        component: UpdatePricesComponent,
    },
];