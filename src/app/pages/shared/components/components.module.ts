import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckStockComponent } from './check-stock/check-stock.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [
    CheckStockComponent
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
