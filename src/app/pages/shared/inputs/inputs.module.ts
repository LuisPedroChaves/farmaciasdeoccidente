import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandComponent } from './brand/brand.component';
import { CellarComponent } from './cellar/cellar.component';
import { FilterComponent } from './filter/filter.component';
import { ProviderComponent } from './provider/provider.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputUserComponent } from './user/user.component';


@NgModule({
  declarations: [BrandComponent, CellarComponent, FilterComponent, ProviderComponent, InputUserComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [
    BrandComponent,
    CellarComponent,
    FilterComponent,
    ProviderComponent,
    InputUserComponent
  ]
})
export class InputsModule { }
