import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersInternalComponent } from './components/orders-internal/orders-internal.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@angular/flex-layout';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { OrdersInternalRoutes } from './orders-internal.routing';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { IncomingScreenComponent } from './components/incoming-screen/incoming-screen.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { HistoryComponent } from './components/history/history.component';



@NgModule({
  declarations: [OrdersInternalComponent, OutgoingComponent, IncomingScreenComponent, IncomingComponent, HistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(OrdersInternalRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class OrdersInternalModule { }
