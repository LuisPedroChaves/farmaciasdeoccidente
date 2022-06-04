import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { AccountingCashReducer } from 'src/app/store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { AccountingCashEffects } from 'src/app/store/effects/accountingCash.effects';

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
import { MyAdminComponent } from './pages/my-admin/my-admin.component';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';

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
    MyAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CashBoxesRoutes),
    StoreModule.forFeature('accountingCash', AccountingCashReducer),
    EffectsModule.forFeature([AccountingCashEffects]),
    SharedComponentsModule,
    ComponentsModule,
    InputsModule,
  ],
  providers: [
    TimeFormatPipe
  ]
})
export class CashBoxesModule { }
