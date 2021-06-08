import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeesRoutes } from './employees.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { EmployeesComponent } from './employees/employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { NewJobComponent } from './new-job/new-job.component';



@NgModule({
  declarations: [EmployeesComponent, NewEmployeeComponent, NewJobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeesRoutes),
    SharedComponentsModule
  ]
})
export class EmployeesModule { }
