import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { PurchasesRoutes } from './purchases.routing';
import { NewPurchaseComponent } from './components/new-purchase/new-purchase.component';
import { IndexComponent } from './components/index/index.component';
import { CurrentPurchasesComponent } from './components/current-purchases/current-purchases.component';
import { DeletedPurchasesComponent } from './components/deleted-purchases/deleted-purchases.component';
import { DetailsPurchaseComponent } from './components/details-purchase/details-purchase.component';



@NgModule({
  declarations: [NewPurchaseComponent, IndexComponent, CurrentPurchasesComponent, DeletedPurchasesComponent, DetailsPurchaseComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PurchasesRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class PurchasesModule { }
