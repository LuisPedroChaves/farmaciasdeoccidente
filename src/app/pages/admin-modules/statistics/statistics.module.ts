import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';
import { StatisticsRoutes } from './statistics.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { LoadStatisticsComponent } from './components/load-statistics/load-statistics.component';
import { ConsolidatedComponent } from './components/consolidated/consolidated.component';
import { StockConsolidatedComponent } from './components/stock-consolidated/stock-consolidated.component';
import { AutoStatisticsComponent } from './components/auto-statistics/auto-statistics.component';
import { NewComponent } from './components/auto-statistics/components/new/new.component';
import { LoadStatisticsGlobalComponent } from './components/auto-statistics/components/load-statistics-global/load-statistics-global.component';
import { EditComponent } from './components/auto-statistics/components/edit/edit.component';

@NgModule({
  declarations: [StatisticsComponent, LoadStatisticsComponent, ConsolidatedComponent, StockConsolidatedComponent, LoadStatisticsGlobalComponent, AutoStatisticsComponent, NewComponent, EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StatisticsRoutes),
    SharedComponentsModule,
    InputsModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    FilterPipe
  ]
})
export class StatisticsModule { }
