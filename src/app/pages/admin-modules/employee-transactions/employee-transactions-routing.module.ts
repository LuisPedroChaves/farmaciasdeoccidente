import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTransactionsComponent } from './components/employee-transactions/employee-transactions.component';

const routes: Routes = [{
  path: '',
  component: EmployeeTransactionsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTransactionsRoutingModule { }
