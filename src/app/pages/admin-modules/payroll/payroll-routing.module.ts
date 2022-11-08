import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPayrollComponent } from './components/edit-payroll/edit-payroll.component';
import { NewPayrollComponent } from './components/new-payroll/new-payroll.component';
import { PayrollComponent } from './components/payroll/payroll.component';

const routes: Routes = [{
  path: '',
  component: PayrollComponent,
}, {
  path: 'new',
  component: NewPayrollComponent
}, {
  path: ':id',
  component: EditPayrollComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
