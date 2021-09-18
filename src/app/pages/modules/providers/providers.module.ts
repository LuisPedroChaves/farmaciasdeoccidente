import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ProvidersRoutes } from './providers.routing';
import { ProvidersComponent } from './components/providers/providers.component';


@NgModule({
  declarations: [ProvidersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProvidersRoutes),
    SharedComponentsModule,
    CoreModule
  ]
})
export class ProvidersModule { }
