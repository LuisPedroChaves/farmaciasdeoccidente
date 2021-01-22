import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './components/sales/sales.component';
import { NewSaleComponent } from './components/new-sale/new-sale.component';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { SalesRoutes } from './sales.routing';



@NgModule({
  declarations: [SalesComponent, NewSaleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SalesRoutes),
    SharedComponentsModule
  ]
})
export class SalesModule { }
