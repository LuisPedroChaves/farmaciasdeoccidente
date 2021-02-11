import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersAdminComponent } from './components/orders-admin/orders-admin.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { OrdersAdminRoutes } from './orders-admin.routing';



@NgModule({
  declarations: [OrdersAdminComponent, NewOrderComponent, EditOrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(OrdersAdminRoutes),
    SharedComponentsModule
  ]
})
export class OrdersAdminModule { }
