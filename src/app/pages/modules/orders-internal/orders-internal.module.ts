import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersInternalComponent } from './components/orders-internal/orders-internal.component';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { OrdersInternalRoutes } from './orders-internal.routing';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { IncomingScreenComponent } from './components/incoming-screen/incoming-screen.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { HistoryComponent } from './components/history/history.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { CoreModule } from 'src/app/core/core.module';
import { NewEntryComponent } from './components/new-entry/new-entry.component';
import { NewPendingComponent } from './components/new-pending/new-pending.component';
import { NewMissingComponent } from './components/new-missing/new-missing.component';
import { DispatchFormComponent } from './components/dispatch-form/dispatch-form.component';



@NgModule({
  declarations: [OrdersInternalComponent, OutgoingComponent, IncomingScreenComponent, IncomingComponent, HistoryComponent, OrderDetailsComponent, NewRequestComponent, NewEntryComponent, NewPendingComponent, NewMissingComponent, DispatchFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(OrdersInternalRoutes),
    CoreModule,
    SharedComponentsModule,
  ]
})
export class OrdersInternalModule { }
