import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckStockComponent } from './pages/check-stock/check-stock.component';
import { RouterModule } from '@angular/router';
import { CheckStockRoutes } from './check-stock.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


@NgModule({
  declarations: [CheckStockComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CheckStockRoutes),
    SharedComponentsModule,
  ]
})
export class CheckStockModule { }
