import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { PayrollComponent } from './components/payroll/payroll.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';
import { CoreModule } from 'src/app/core/core.module';
import { EditPayrollComponent } from './components/edit-payroll/edit-payroll.component';

@NgModule({
  declarations: [
    PayrollComponent,
    NewPayrollComponent,
    EditPayrollComponent
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    SharedComponentsModule,
    CoreModule,
  ]
})
export class PayrollModule { }
