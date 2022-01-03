import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StatisticsComponent } from './pages/statistics/statistics.component';
import { StatisticsRoutes } from './statistics.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { LoadStatisticsComponent } from './components/load-statistics/load-statistics.component';
import { ConsolidatedComponent } from './components/consolidated/consolidated.component';

@NgModule({
  declarations: [StatisticsComponent, LoadStatisticsComponent, ConsolidatedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StatisticsRoutes),
    SharedComponentsModule,
  ]
})
export class StatisticsModule { }
