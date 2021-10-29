import { Routes } from '@angular/router';
import { InventoryClosingComponent } from './components/inventory-closing/inventory-closing.component';
import { StorageComponent } from './components/storage/storage.component';

export const StorageRoutes: Routes = [
  {
    path: '',
    component: StorageComponent,
  },
  {
    path: 'storageclosing',
    component: InventoryClosingComponent,
  },
];
