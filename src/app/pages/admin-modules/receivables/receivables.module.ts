import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReceivablesRoutes } from './receivables.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ReceivablesComponent } from './components/receivables/receivables.component';



@NgModule({
  declarations: [ReceivablesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ReceivablesRoutes),
    SharedComponentsModule
  ]
})
export class ReceivablesModule { }
