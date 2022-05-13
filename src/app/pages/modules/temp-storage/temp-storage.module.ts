import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { TempStorageComponent } from './components/temp-storage/temp-storage.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { TempStorageRoutes } from './temp-storage.routing';
import { InputsModule } from '../../shared/inputs/inputs.module';

@NgModule({
  declarations: [TempStorageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TempStorageRoutes),
    SharedComponentsModule,
    CoreModule,
    InputsModule
  ],
  providers: [
    TimeFormatPipe
  ]
})
export class TempStorageModule { }
