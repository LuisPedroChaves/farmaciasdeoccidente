import { Routes } from "@angular/router";
import { HistoryComponent } from "./components/history/history.component";
import { IncomingScreenComponent } from "./components/incoming-screen/incoming-screen.component";
import { IncomingComponent } from "./components/incoming/incoming.component";
import { OrdersInternalComponent } from "./components/orders-internal/orders-internal.component";
import { OutgoingComponent } from "./components/outgoing/outgoing.component";

export const OrdersInternalRoutes: Routes = [{
    path: '',
    component: OrdersInternalComponent,
    children: [
      { path: 'incomingScreen', component: IncomingScreenComponent },
      { path: 'incoming', component: IncomingComponent },
      { path: 'outgoing', component: OutgoingComponent },
      { path: 'history', component: HistoryComponent },
      { path: '', redirectTo: 'outgoing' }
    ]
  }];
  