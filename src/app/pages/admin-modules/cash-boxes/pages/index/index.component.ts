import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PermissionItem } from 'src/app/core/models/Role';
import { READ_CASH } from 'src/app/store/actions/accounting-cash.actions';
import { AccountingCashStore } from 'src/app/store/reducers/accounting-cash.reducer';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  sessionSubscription: Subscription;
  modules: PermissionItem[] = [];

  constructor(
    public router: Router,
    public store: Store<AccountingCashStore>,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(READ_CASH())

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        this.modules = session.permissions.filter(pr => pr.parent === 'cash');

        const MODULE_TYPES = {
          'cashAdmin': () => this.router.navigate(['/admin/cash']),
          'cashMyAdmin': () => this.router.navigate(['/admin/cash/myAdmin']),
          'cashIndependentBox': () => this.router.navigate(['/admin/cash/independentBox']),
          'cashAccountingBox': () => this.router.navigate(['/admin/cash/accountingBox']),
        }

        if (this.modules.length > 0) {
          MODULE_TYPES[this.modules[0].name]();
        }

      }
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

  searchModule(name: string): Boolean {
    return this.modules.find(m => m.name === name) ? true : false;
  }

}
