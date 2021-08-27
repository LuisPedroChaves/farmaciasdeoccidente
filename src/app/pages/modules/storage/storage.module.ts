import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { StorageRoutes } from './storage.routing';
import { StorageComponent } from './components/storage/storage.component';



@NgModule({
  declarations: [StorageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StorageRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class StorageModule { }
