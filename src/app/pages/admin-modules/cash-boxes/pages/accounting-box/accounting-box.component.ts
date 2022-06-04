import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CashItem } from 'src/app/core/models/Cash';
import { AccountingCashStore } from 'src/app/store/reducers/accountingCash.reducer';

@Component({
  selector: 'app-accounting-box',
  templateUrl: './accounting-box.component.html',
  styleUrls: ['./accounting-box.component.scss']
})
export class AccountingBoxComponent implements OnInit, OnDestroy {

  currentCash: CashItem;

  accountingCashSubscription: Subscription;
  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    public store: Store<AccountingCashStore>,
  ) { }

  ngOnInit(): void {

    this.accountingCashSubscription = this.store.select('accountingCash')
      .pipe(
        filter(accountingCash => accountingCash.cash !== null),
      )
      .subscribe(accountingCash => {
        if (accountingCash.cash) {
          this.currentCash = accountingCash.cash
        }
      });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'cashAccountingBox');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngOnDestroy() {
    this.accountingCashSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

}
