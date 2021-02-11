import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './components/sales/sales.component';
import { NewSaleComponent } from './components/new-sale/new-sale.component';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { SalesRoutes } from './sales.routing';
import { EditSaleComponent } from './components/edit-sale/edit-sale.component';
import { PaySaleComponent } from './components/pay-sale/pay-sale.component';
import { CoreModule } from '../../../core/core.module';



@NgModule({
  declarations: [SalesComponent, NewSaleComponent, EditSaleComponent, PaySaleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SalesRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class SalesModule { }
