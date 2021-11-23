import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { TempStorageComponent } from './components/temp-storage/temp-storage.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { TempStorageRoutes } from './temp-storage.routing';
import { ModalStatisticsComponent } from './components/modal-statistics/modal-statistics.component';



@NgModule({
  declarations: [TempStorageComponent, ModalStatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TempStorageRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class TempStorageModule { }
