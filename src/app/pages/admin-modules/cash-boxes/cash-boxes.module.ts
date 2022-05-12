import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CashBoxesRoutes } from './cash-boxes.routing';
import { AdminComponent } from './pages/admin/admin.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { NewCashComponent } from './components/new-cash/new-cash.component';
import { IndependentBoxComponent } from './pages/independent-box/independent-box.component';
import { AccountingBoxComponent } from './pages/accounting-box/accounting-box.component';
import { IndependentCashComponent } from './components/independent-cash/independent-cash.component';
import { AccountingCashComponent } from './components/accounting-cash/accounting-cash.component';
import { NewCashFlowComponent } from './components/new-cash-flow/new-cash-flow.component';

@NgModule({
  declarations: [
    IndexComponent,
    AdminComponent,
    NewCashComponent,
    IndependentBoxComponent,
    AccountingBoxComponent,
    IndependentCashComponent,
    AccountingCashComponent,
    NewCashFlowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CashBoxesRoutes),
    SharedComponentsModule,
    ComponentsModule,
    InputsModule,
  ]
})
export class CashBoxesModule { }
