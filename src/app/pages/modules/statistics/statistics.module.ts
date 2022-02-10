import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { IndexComponent } from './pages/index/index.component';
import { LoadStatisticsComponent } from './components/load-statistics/load-statistics.component';
import { StatisticsRoutes } from './statistics.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';


@NgModule({
  declarations: [
    IndexComponent,
    LoadStatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(StatisticsRoutes),
    SharedComponentsModule,
    CoreModule,
    InputsModule
  ],
  providers: [
    TimeFormatPipe
  ]
})
export class StatisticsModule { }
