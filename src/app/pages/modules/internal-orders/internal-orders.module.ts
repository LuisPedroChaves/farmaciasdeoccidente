import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternalOrdersRoutes } from './internal-orders.routing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InternalOrdersComponent } from './components/internal-orders/internal-orders.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { HistoryComponent } from './components/history/history.component';
import { NewInternalOorderComponent } from './components/new-internal-oorder/new-internal-oorder.component';



@NgModule({
  declarations: [InternalOrdersComponent, IncomingComponent, OutgoingComponent, HistoryComponent, NewInternalOorderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(InternalOrdersRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class InternalOrdersModule { }
