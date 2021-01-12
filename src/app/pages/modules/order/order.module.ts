import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderRoutes } from './order.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { SelectOrderComponent } from './components/select-order/select-order.component';



@NgModule({
  declarations: [SelectOrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(OrderRoutes),
    SharedComponentsModule
  ]
})
export class OrderModule { }
