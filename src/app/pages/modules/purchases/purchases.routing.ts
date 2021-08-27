import { Routes } from '@angular/router';
import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { IndexComponent } from './components/index/index.component';

export const PurchasesRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
    },
    {
        path: 'new',
        component: NewPurchaseComponent,
    },
];