import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckStockComponent } from './check-stock/check-stock.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CoreModule } from '../../../core/core.module';
import { DetailsQuotesComponent } from './details-quotes/details-quotes.component';

@NgModule({
  declarations: [
    CheckStockComponent,
    DetailsQuotesComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [
    CheckStockComponent
  ]
})
export class ComponentsModule { }
