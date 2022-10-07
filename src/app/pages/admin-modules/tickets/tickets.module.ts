import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './pages/index/index.component';
import { RouterModule } from '@angular/router';
import { TicketsRoutes } from './tickets.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';



@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TicketsRoutes),
    SharedComponentsModule
  ]
})
export class TicketsModule { }
