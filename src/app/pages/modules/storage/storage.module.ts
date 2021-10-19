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



@NgModule({
  declarations: [StorageComponent, ModalMovementsComponent, GeneralInventoryComponent, PendingInventoryComponent, LoteDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StorageRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class StorageModule { }
