import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiConfigService } from './config/api-config.service';
import { NumberToWordsPipe } from '../shared/pipes/formatPipes/number-to-words.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApiConfigService,
    NumberToWordsPipe
  ]
})
export class ServicesModule { }
