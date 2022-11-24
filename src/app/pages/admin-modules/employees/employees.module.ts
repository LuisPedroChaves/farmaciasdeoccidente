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
import { NewDepartmentComponent } from './new-department/new-department.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { FilePipe } from 'src/app/core/shared/pipes/filePipes/file.pipe';


@NgModule({
  declarations: [EmployeesComponent, NewEmployeeComponent, NewJobComponent, NewEmployeeJobComponent, NewDepartmentComponent, DepartmentListComponent, UploadAvatarComponent, EditEmployeeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeesRoutes),
    SharedComponentsModule,
    CoreModule,
    MatStepperModule
  ],
  providers: [FilePipe]
})
export class EmployeesModule { }
