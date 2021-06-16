import { Routes } from '@angular/router';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';

export const DeliveriesRoutes: Routes = [{
    path: '',
    component: DeliveriesComponent
},{
    path: 'delivery/:id',
    component: DeliveryDetailsComponent
}];