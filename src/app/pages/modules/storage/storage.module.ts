import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { StorageRoutes } from './storage.routing';
import { StorageComponent } from './components/storage/storage.component';
import { ModalMovementsComponent } from './components/modal-movements/modal-movements.component';
import { GeneralInventoryComponent } from './components/general-inventory/general-inventory.component';
import { PendingInventoryComponent } from './components/pending-inventory/pending-inventory.component';
import { LoteDetailsComponent } from './components/lote-details/lote-details.component';
import { KardexOutputComponent } from './components/kardex-output/kardex-output.component';
import { KardexIncomeComponent } from './components/kardex-income/kardex-income.component';
import { InventoryClosingComponent } from './components/inventory-closing/inventory-closing.component';
import { StorageInventoriedComponent } from './components/storage-inventoried/storage-inventoried.component';
import { ActivityInventoryComponent } from './components/activity-inventory/activity-inventory.component';
import { InventoriedProductsComponent } from './components/inventoried-products/inventoried-products.component';
import { StorageHistoryComponent } from './components/storage-history/storage-history.component';

@NgModule({
  declarations: [
    StorageComponent,
    ModalMovementsComponent,
    GeneralInventoryComponent,
    PendingInventoryComponent,
    LoteDetailsComponent,
    KardexOutputComponent,
    KardexIncomeComponent,
    InventoryClosingComponent,
    StorageInventoriedComponent,
    ActivityInventoryComponent,
    InventoriedProductsComponent,
    StorageHistoryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(StorageRoutes),
    SharedComponentsModule,
    CoreModule,
  ],
})
export class StorageModule {}
