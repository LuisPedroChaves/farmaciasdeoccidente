import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomersRoutes } from './customers-routes.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CustomersRoutesComponent } from './components/customers-routes/customers-routes.component';
import { EditCustomerRoutesComponent } from './components/edit-customer-routes/edit-customer-routes.component';
import { NewCustomerRoutesComponent } from './components/new-customer-routes/new-customer-routes.component';



@NgModule({
  declarations: [CustomersRoutesComponent, EditCustomerRoutesComponent, NewCustomerRoutesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CustomersRoutes),
    SharedComponentsModule
  ]
})
export class CustomersRoutesModule { }
