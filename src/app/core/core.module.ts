import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from './services/services.module';
import { PipesModule } from './shared/pipes/pipes.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    ServicesModule
  ],
  exports: [
    PipesModule,
    ServicesModule
  ]
})
export class CoreModule { }
