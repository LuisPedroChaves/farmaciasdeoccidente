import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveriesRoutes } from './deliveries.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';



@NgModule({
  declarations: [DeliveryListComponent, DeliveriesComponent, ShipmentsComponent, DeliveryDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DeliveriesRoutes),
    SharedComponentsModule
  ]
})
export class DeliveriesModule { }
