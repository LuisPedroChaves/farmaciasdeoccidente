import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingComponent } from './components/incoming/incoming.component';
import { HistoryComponent } from './components/history/history.component';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { NewTransferComponent } from './components/new-transfer/new-transfer.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { RouterModule } from '@angular/router';
import { TransferRoutes } from './transfer.routing';
import { CoreModule } from '@angular/flex-layout';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';



@NgModule({
  declarations: [IncomingComponent, HistoryComponent, NewRequestComponent, NewTransferComponent, TransfersComponent, OutgoingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TransferRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class TransferModule { }
