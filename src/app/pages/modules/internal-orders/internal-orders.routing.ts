import { Routes } from '@angular/router';
import { InternalOrdersComponent } from './components/internal-orders/internal-orders.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { HistoryComponent } from './components/history/history.component';
import { OutgoingComponent } from './components/outgoing/outgoing.component';


export const InternalOrdersRoutes: Routes = [{
  path: '',
  component: InternalOrdersComponent,
  children: [
    { path: 'incoming', component: IncomingComponent },
    { path: 'outgoing', component: OutgoingComponent },
    { path: 'history', component: HistoryComponent },
    { path: '', redirectTo: 'incoming' }
  ]
}];
