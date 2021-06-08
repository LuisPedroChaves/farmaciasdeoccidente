import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveriesRoutes } from './deliveries.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { CoreModule } from '../../../core/core.module';
import { NewRouteComponent } from './components/new-route/new-route.component';
import { EditRouteComponent } from './components/edit-route/edit-route.component';

@NgModule({
  declarations: [DeliveryListComponent, DeliveriesComponent, ShipmentsComponent, NewRouteComponent, EditRouteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DeliveriesRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class DeliveriesModule { }
