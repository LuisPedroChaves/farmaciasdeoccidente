import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from 'src/app/core/core.module';
import { IndexComponent } from './pages/index/index.component';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { AccountsPayableRoutes } from './accounts-payable.routing';
import { InputsModule } from '../../shared/inputs/inputs.module';
import { ProvidersComponent } from './pages/providers/providers.component';
import { ChequesComponent } from './pages/cheques/cheques.component';
import { NewEditComponent } from './components/new-edit/new-edit.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ProviderAccountComponent } from './components/provider-account/provider-account.component';
import { ComponentsModule } from '../../shared/components/components.module';
import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';
import { ProgressBalanceComponent } from './components/progress-balance.component';
import { NewCheckComponent } from './components/new-check/new-check.component';
import { NewProviderComponent } from './components/new-provider/new-provider.component';
import { NewBalanceComponent } from './components/new-balance/new-balance.component';
import { AccountsPayableComponent } from './components/accounts-payable/accounts-payable.component';
import { CheckComponent } from './components/check/check.component';
import { CheckDeliveriesComponent } from './pages/check-deliveries/check-deliveries.component';
import { EnterPaymentComponent } from './components/enter-payment/enter-payment.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { TableAccountsPayableComponent } from './components/table-accounts-payable/table-accounts-payable.component';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { ReportProviderComponent } from './components/report-provider/report-provider.component';
import { ReportGlobalExpenseComponent } from './components/report-global-expense/report-global-expense.component';
import { BanksComponent } from './pages/banks/banks.component';
import { BankReducer } from 'src/app/store/reducers/bank.reducer';
import { NewBankComponent } from './components/new-bank/new-bank.component';
import { BankEffects } from 'src/app/store/effects/bank.effects';
import { NewBankAccountComponent } from './components/new-bank-account/new-bank-account.component';

@NgModule({
  declarations: [
    IndexComponent,
    ProvidersComponent,
    ExpensesComponent,
    ChequesComponent,
    NewEditComponent,
    DocumentsComponent,
    ProviderAccountComponent,
    ProgressBalanceComponent,
    NewCheckComponent,
    NewProviderComponent,
    NewBalanceComponent,
    AccountsPayableComponent,
    CheckComponent,
    CheckDeliveriesComponent,
    EnterPaymentComponent,
    ReportsComponent,
    TableAccountsPayableComponent,
    ReportProviderComponent,
    ReportGlobalExpenseComponent,
    BanksComponent,
    NewBankComponent,
    NewBankAccountComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AccountsPayableRoutes),
    StoreModule.forFeature('Bank', BankReducer),
    EffectsModule.forFeature([BankEffects]),
    SharedComponentsModule,
    InputsModule,
    ComponentsModule,
    CoreModule
  ],
  providers: [
    FilterPipe,
    TimeFormatPipe
  ]
})
export class AccountsPayableModule { }
