import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandComponent } from './brand/brand.component';
import { CellarComponent } from './cellar/cellar.component';
import { FilterComponent } from './filter/filter.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';


@NgModule({
  declarations: [BrandComponent, CellarComponent, FilterComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ],
  exports: [
    BrandComponent,
    CellarComponent,
    FilterComponent
  ]
})
export class InputsModule { }
