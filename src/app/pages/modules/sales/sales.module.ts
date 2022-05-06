import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { SalesRoutes } from './sales.routing';
import { PaySaleComponent } from './components/pay-sale/pay-sale.component';
import { CoreModule } from '../../../core/core.module';
import { IndexComponent } from './pages/index/index.component';
import { ListSalesComponent } from './components/list-sales/list-sales.component';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { NewSaleComponent } from './components/new-sale/new-sale.component';
import { ComponentsModule } from '../../shared/components/components.module';



@NgModule({
  declarations: [PaySaleComponent, IndexComponent, ListSalesComponent, NewSaleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SalesRoutes),
    SharedComponentsModule,
    CoreModule,
    InputsModule,
    ComponentsModule,
  ]
})
export class SalesModule { }
