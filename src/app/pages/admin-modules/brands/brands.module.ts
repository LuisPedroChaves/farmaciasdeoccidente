import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { IndexComponent } from './pages/index/index.component';
import { BrandsRoutes } from './brands.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { FilterPipe } from '../../../core/shared/pipes/filterPipes/filter.pipe';
import { NewEditComponent } from './components/new-edit/new-edit.component';

@NgModule({
  declarations: [
    IndexComponent,
    NewEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BrandsRoutes),
    SharedComponentsModule,
    InputsModule,
    CoreModule,
  ],
  providers: [
    FilterPipe
  ]
})
export class BrandsModule { }
