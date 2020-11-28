import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { UsersRoutes } from './users.routing';
import { UsersComponent } from './components/users/users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { NewRoleComponent } from './components/new-role/new-role.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';



@NgModule({
  declarations: [
    UsersComponent,
    UserDetailsComponent,
    NewUserComponent,
    NewRoleComponent,
    EditRoleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    SharedComponentsModule
  ]
})
export class UsersModule { }
