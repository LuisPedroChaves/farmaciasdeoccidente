import { Routes } from '@angular/router';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ReportsComponent } from './components/reports/reports.component';

export const ReportsRoutes: Routes = [{
    path: '',
    component: ReportsComponent,
    children: [
        {
            path: 'orders',
            component: ReportListComponent
        },
        {
            path: 'reporte2',
            component: ReportListComponent
        },
        { path: '', redirectTo: 'orders' }
    ],
}];
