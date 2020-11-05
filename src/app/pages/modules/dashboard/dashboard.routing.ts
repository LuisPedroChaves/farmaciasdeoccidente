import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// import { DashboardGuard } from '../../../core/auth/dashboard.guard';
// import { DashboardCpoComponent } from './components/dashboard-cpo/dashboard-cpo.component';
// import { DashboardSeoComponent } from './components/dashboard-seo/dashboard-seo.component';

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        // canActivate: [DashboardGuard]
    },
    // {
    //     path: 'dashboard-cpo',
    //     component: DashboardCpoComponent,
    // },
    // {
    //     path: 'dashboard-seo',
    //     component: DashboardSeoComponent,
    // }
];
