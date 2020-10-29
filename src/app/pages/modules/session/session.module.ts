import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionRoutes } from './session.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { SigninComponent } from './signin/signin.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [SigninComponent, NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SessionRoutes),
    SharedComponentsModule
  ]
})
export class SessionModule { }
