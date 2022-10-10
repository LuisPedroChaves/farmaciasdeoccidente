import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './pages/index/index.component';
import { RouterModule } from '@angular/router';
import { TicketsRoutes } from './tickets.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(TicketsRoutes),
    SharedComponentsModule,
    InputsModule,
    QRCodeModule
  ]
})
export class TicketsModule { }
