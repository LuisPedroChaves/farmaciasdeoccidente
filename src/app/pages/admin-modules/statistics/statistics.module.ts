import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StatisticsRoutes } from './statistics.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { LoadStatisticsComponent } from './components/load-statistics/load-statistics.component';
import { ConsolidatedComponent } from './components/consolidated/consolidated.component';
import { StockConsolidatedComponent } from './components/stock-consolidated/stock-consolidated.component';
import { LoadStatisticsGlobalComponent } from './components/load-statistics-global/load-statistics-global.component';

@NgModule({
  declarations: [StatisticsComponent, LoadStatisticsComponent, ConsolidatedComponent, StockConsolidatedComponent, LoadStatisticsGlobalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StatisticsRoutes),
    SharedComponentsModule,
    InputsModule
  ]
})
export class StatisticsModule { }
