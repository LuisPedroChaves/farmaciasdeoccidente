import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { EditRouteComponent } from './components/edit-route/edit-route.component';
import { NewRouteComponent } from './components/new-route/new-route.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';
import { RouterModule } from '@angular/router';
import { DeliveriesRoutes } from './deliveries.routing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';



@NgModule({
  declarations: [DeliveriesComponent, DeliveryListComponent, EditRouteComponent, NewRouteComponent, ShipmentsComponent, DeliveryDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DeliveriesRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class DeliveriesModule { }
