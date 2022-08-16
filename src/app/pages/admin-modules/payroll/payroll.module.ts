import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './components/payroll/payroll.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CoreModule } from '@angular/flex-layout';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';

@NgModule({
  declarations: [
    PayrollComponent,
    NewPayrollComponent
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    SharedComponentsModule,
    CoreModule,
  ]
})
export class PayrollModule { }
