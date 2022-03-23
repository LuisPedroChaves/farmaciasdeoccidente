import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { UploadsComponent } from './components/uploads/uploads.component';
import { UploadsRoutes } from './uploads.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { IndexComponent } from './pages/index/index.component';
import { ProductsComponent } from './components/products/products.component';
import { StockComponent } from './components/stock/stock.component';
import { SalesComponent } from './components/sales/sales.component';

@NgModule({
  declarations: [UploadsComponent, IndexComponent, ProductsComponent, StockComponent, SalesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UploadsRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class UploadsModule { }
