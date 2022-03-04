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

@NgModule({
  declarations: [
    IndexComponent,
    ProvidersComponent,
    ExpensesComponent,
    ChequesComponent,
    NewEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AccountsPayableRoutes),
    SharedComponentsModule,
    InputsModule
  ]
})
export class AccountsPayableModule { }
