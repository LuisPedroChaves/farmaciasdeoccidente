import { Routes } from '@angular/router';
import { HistoryComponent } from './components/history/history.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { OutgoingComponent } from './components/outgoing/outgoing.component';
import { TransfersComponent } from './components/transfers/transfers.component';


export const TransfersRoutes: Routes = [{
  path: '',
  component: TransfersComponent,
  children: [
    { path: 'incoming', component: IncomingComponent },
    { path: 'outgoing', component: OutgoingComponent },
    { path: 'history', component: HistoryComponent },
    { path: '', redirectTo: 'incoming' }
  ]
}];
