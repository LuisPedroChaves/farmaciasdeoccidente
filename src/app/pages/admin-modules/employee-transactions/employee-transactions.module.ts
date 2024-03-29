import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTransactionsRoutingModule } from './employee-transactions-routing.module';
import { EmployeeTransactionsComponent } from './components/employee-transactions/employee-transactions.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CoreModule } from 'src/app/core/core.module';
import { NewDiscountComponent } from './components/new-discount/new-discount.component';
import { NewRisingComponent } from './components/new-rising/new-rising.component';


@NgModule({
  declarations: [
    EmployeeTransactionsComponent,
    NewDiscountComponent,
    NewRisingComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    CoreModule,
    EmployeeTransactionsRoutingModule
  ]
})
export class EmployeeTransactionsModule { }
