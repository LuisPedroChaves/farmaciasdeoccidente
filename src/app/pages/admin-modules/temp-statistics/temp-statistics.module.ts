import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { TempStatisticsRoutes } from './temp-statistics.routing';
import { TempStatisticsComponent } from './pages/temp-statistics/temp-statistics.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


@NgModule({
  declarations: [TempStatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TempStatisticsRoutes),
    SharedComponentsModule,
  ],
  providers: [
    TimeFormatPipe
  ]
})
export class TempStatisticsModule { }
