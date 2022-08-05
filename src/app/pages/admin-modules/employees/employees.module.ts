import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeesRoutes } from './employees.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { EmployeesComponent } from './employees/employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { NewJobComponent } from './new-job/new-job.component';
import { CoreModule } from 'src/app/core/core.module';
import {MatStepperModule} from '@angular/material/stepper';
import { NewEmployeeJobComponent } from './new-employee-job/new-employee-job.component';


@NgModule({
  declarations: [EmployeesComponent, NewEmployeeComponent, NewJobComponent, NewEmployeeJobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeesRoutes),
    SharedComponentsModule,
    CoreModule,
    MatStepperModule
  ]
})
export class EmployeesModule { }
