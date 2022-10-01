import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './components/requests/requests.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { RequestDialogComponent } from './components/request-dialog/request-dialog.component';


@NgModule({
  declarations: [
    RequestsComponent,
    RequestDialogComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedComponentsModule,
    RequestsRoutingModule
  ]
})
export class RequestsModule { }
