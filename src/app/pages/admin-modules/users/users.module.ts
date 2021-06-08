import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { UsersRoutes } from './users.routing';
import { UsersComponent } from './components/users/users.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleEditComponent } from './components/role-edit/role-edit.component';
import { NewRoleComponent } from './components/new-role/new-role.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    NewUserComponent,
    UserDetailsComponent,
    RoleListComponent,
    RoleEditComponent,
    NewRoleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    SharedComponentsModule
  ]
})
export class UsersModule { }
