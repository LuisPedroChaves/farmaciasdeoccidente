import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { PurchasesRoutes } from './purchases.routing';
import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { DeletedPurchasesComponent } from './components/deleted-purchases/deleted-purchases.component';
import { DetailsPurchaseComponent } from './components/details-purchase/details-purchase.component';
import { UpdatePricesComponent } from './components/update-prices/update-prices.component';
import { NewAdjustComponent } from './components/new-adjust/new-adjust.component';
import { CreatedPurchasesComponent } from './components/created-purchases/created-purchases.component';
import { UpdatedPurchasesComponent } from './components/updated-purchases/updated-purchases.component';
import { HistoryPurchasesComponent } from './components/history-purchases/history-purchases.component';
import { RequisitionPurchasesComponent } from './components/requisition-purchases/requisition-purchases.component';
import { NewRequisitionComponent } from './components/new-requisition/new-requisition.component';
import { AdjustsComponent } from './components/adjusts/adjusts.component';
import { IndexComponent } from './pages/index/index.component';



@NgModule({
  declarations: [NewPurchaseComponent, IndexComponent, DeletedPurchasesComponent, DetailsPurchaseComponent, UpdatePricesComponent, NewAdjustComponent, CreatedPurchasesComponent, UpdatedPurchasesComponent, HistoryPurchasesComponent, RequisitionPurchasesComponent, NewRequisitionComponent, AdjustsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PurchasesRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class PurchasesModule { }
