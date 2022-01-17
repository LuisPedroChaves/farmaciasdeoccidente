import { Routes } from '@angular/router';
import { InventoryClosingComponent } from './components/inventory-closing/inventory-closing.component';
import { StorageComponent } from './components/storage/storage.component';
import { StorageHistoryComponent } from './components/storage-history/storage-history.component';

export const StorageRoutes: Routes = [
  {
    path: '',
    component: StorageComponent,
  },
  // {
  //   path: '',
  //   component: InventoryClosingComponent,
  // },
  // {
  //   path: '',
  //   component: StorageHistoryComponent,
  // },
];
