import { from } from 'rxjs';
import { Routes } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';

export const OrdersRoutes: Routes = [{
    path: '',
    component: OrdersComponent
}];
