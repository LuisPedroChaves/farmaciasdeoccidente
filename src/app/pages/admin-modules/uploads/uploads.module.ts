import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { UploadsComponent } from './components/uploads/uploads.component';
import { UploadsRoutes } from './uploads.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';

@NgModule({
  declarations: [UploadsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UploadsRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class UploadsModule { }
