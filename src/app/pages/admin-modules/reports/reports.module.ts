import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import { RouterModule } from '@angular/router';
import { ReportsRoutes } from './reports.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';



@NgModule({
  declarations: [ReportsComponent, ReportListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    SharedComponentsModule
  ]
})
export class ReportsModule { }
