import { Routes } from '@angular/router';
import { DashboardGuard } from 'src/app/core/auth/dashboard.guard';
import { DashboardPharmaComponent } from './components/dashboard-pharma/dashboard-pharma.component';
import { DashboardFactoryComponent } from './components/dashboard-factory/dashboard-factory.component';
import { DashboardDeliveryComponent } from './components/dashboard-delivery/dashboard-delivery.component';
import { DashboardSellerComponent } from './components/dashboard-seller/dashboard-seller.component';

export const DashboardsRoutes: Routes = [
    {
        path: '',
        component: DashboardPharmaComponent,
        canActivate: [DashboardGuard]
    },
    {
        path: 'factory',
        component: DashboardFactoryComponent,
    },
    {
        path: 'delivery',
        component: DashboardDeliveryComponent,
    },
    {
        path: 'seller',
        component: DashboardSellerComponent,
    }
];
