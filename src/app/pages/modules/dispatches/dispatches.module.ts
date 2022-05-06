import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DispatchesRoutes } from './dispatches.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { DispatchesComponent } from './components/dispatches/dispatches.component';
import { CoreModule } from 'src/app/core/core.module';
import { ComponentsModule } from '../../shared/components/components.module';



@NgModule({
  declarations: [DispatchesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DispatchesRoutes),
    CoreModule,
    SharedComponentsModule,
    ComponentsModule
  ]
})
export class DispatchesModule { }
