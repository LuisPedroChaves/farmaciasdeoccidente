import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    // CoreModule,
    SharedComponentsModule
  ]
})
export class DashboardModule { }
