import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './pages/index/index.component';
import { RouterModule } from '@angular/router';

import { CheckStockRoutes } from './check-stock.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CheckStockRoutes),
    SharedComponentsModule,
    ComponentsModule
  ]
})
export class CheckStockModule { }
