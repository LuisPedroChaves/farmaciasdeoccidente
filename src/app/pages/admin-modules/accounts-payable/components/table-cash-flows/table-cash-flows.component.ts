import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { AccountsPayableStore } from 'src/app/store/reducers';

@Component({
  selector: 'app-table-cash-flows',
  templateUrl: './table-cash-flows.component.html',
  styleUrls: ['./table-cash-flows.component.scss']
})
export class TableCashFlowsComponent implements OnInit, OnDestroy {

  accountsPayableStore: Subscription

  cashFlowsSource = new MatTableDataSource([]);
  columns = [
    'date',
    'document',
    'details',
    'income',
    'outflow',
    'balance',
  ];

  constructor(
    private store: Store<AccountsPayableStore>
  ) { }

  ngOnInit(): void {
    this.accountsPayableStore = this.store.select('accountsPayable')
      .subscribe(state => {
        this.cashFlowsSource = new MatTableDataSource<CashFlowItem>(state.cashFlows);
      })
  }

  ngOnDestroy(): void {
    this.accountsPayableStore?.unsubscribe()
  }

}
