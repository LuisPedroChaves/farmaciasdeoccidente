import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { IndexComponent } from './components/index/index.component';
import { SellerReportRoutes } from './seller-report.routing';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { WorstSellersComponent } from './components/worst-sellers/worst-sellers.component';
import { InputsModule } from '../../shared/inputs/inputs.module';



@NgModule({
  declarations: [IndexComponent, BestSellersComponent, WorstSellersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(SellerReportRoutes),
    SharedComponentsModule,
    InputsModule,
  ]
})
export class SellerReportModule { }
