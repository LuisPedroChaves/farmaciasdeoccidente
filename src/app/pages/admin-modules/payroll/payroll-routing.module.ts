import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';
import { PayrollComponent } from './components/payroll/payroll.component';

const routes: Routes = [{
  path: '',
  component: PayrollComponent,
}, {
  path: 'new',
  component: NewPayrollComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
