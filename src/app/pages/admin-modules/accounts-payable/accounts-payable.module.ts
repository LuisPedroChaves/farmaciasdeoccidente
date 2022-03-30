import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
import { NumberToWordsPipe } from '../../../core/shared/pipes/formatPipes/number-to-words.pipe';
import { NewProviderComponent } from './components/new-provider/new-provider.component';
import { NewBalanceComponent } from './components/new-balance/new-balance.component';

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
    NewBalanceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AccountsPayableRoutes),
    SharedComponentsModule,
    InputsModule,
    ComponentsModule
  ],
  providers: [
    FilterPipe,
    NumberToWordsPipe
  ]
})
export class AccountsPayableModule { }
