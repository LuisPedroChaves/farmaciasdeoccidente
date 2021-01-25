import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardsRoutes } from './dashboards.routing';
import { DashboardGuard } from 'src/app/core/auth/dashboard.guard';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DashboardFactoryComponent } from './components/dashboard-factory/dashboard-factory.component';
import { DashboardPharmaComponent } from './components/dashboard-pharma/dashboard-pharma.component';
import { DashboardDeliveryComponent } from './components/dashboard-delivery/dashboard-delivery.component';
import { DashboardSellerComponent } from './components/dashboard-seller/dashboard-seller.component';



@NgModule({
  declarations: [DashboardFactoryComponent, DashboardPharmaComponent, DashboardDeliveryComponent, DashboardSellerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardsRoutes),
    SharedComponentsModule,
  ],
  providers: [DashboardGuard]
})
export class DashboardsModule { }
