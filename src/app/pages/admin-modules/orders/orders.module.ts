import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { RouterModule } from '@angular/router';
import { OrdersRoutes } from './orders.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';



@NgModule({
  declarations: [OrdersComponent, NewOrderComponent, EditOrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(OrdersRoutes),
    SharedComponentsModule
  ],
  providers: [
    TimeFormatPipe
  ]
})
export class OrdersModule { }
