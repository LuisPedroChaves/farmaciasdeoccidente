import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { AdjustsRoutes } from './adjusts.routing';
import { AdjustsComponent } from './components/adjusts/adjusts.component';



@NgModule({
  declarations: [AdjustsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AdjustsRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class AdjustsModule { }
