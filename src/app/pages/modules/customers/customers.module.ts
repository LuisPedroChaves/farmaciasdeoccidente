import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomersRoutes } from './customers.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CustomersComponent } from './components/customers/customers.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { NewCustomersComponent } from './components/new-customers/new-customers.component';



@NgModule({
  declarations: [CustomersComponent, EditCustomerComponent, NewCustomersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CustomersRoutes),
    SharedComponentsModule
  ]
})
export class CustomersModule { }
