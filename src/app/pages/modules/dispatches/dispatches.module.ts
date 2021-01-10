import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DispatchesRoutes } from './dispatches.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DispatchesComponent } from './components/dispatches/dispatches.component';



@NgModule({
  declarations: [DispatchesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DispatchesRoutes),
    SharedComponentsModule
  ]
})
export class DispatchesModule { }
