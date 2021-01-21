import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransfersRoutes } from './transfer.routing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { TransfersComponent } from './components/transfers/transfers.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { HistoryComponent } from './components/history/history.component';
import { NewTransferComponent } from './components/new-transfer/new-transfer.component';



@NgModule({
  declarations: [TransfersComponent, IncomingComponent, OutgoingComponent, HistoryComponent, NewTransferComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TransfersRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class TransfersModule { }
