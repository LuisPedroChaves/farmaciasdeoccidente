import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PermissionItem } from 'src/app/core/models/Role';
import { READ_BANK_ACCOUNTS } from 'src/app/store/actions';
import { BankStore } from '../../../../../store/reducers/bank.reducer';

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
    public store: Store<BankStore>,
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        this.modules = session.permissions.filter(pr => pr.parent === 'accountsPayable');

        const MODULE_TYPES = {
          'accountsPyabaleProviders': () => this.router.navigate(['/admin/accountsPayable']),
          'accountsPyabaleCashRequisitions': () => this.router.navigate(['/admin/accountsPayable/cashRequisitions']),
          'accountsPyabaleDocuments': () => this.router.navigate(['/admin/accountsPayable/documents']),
          'accountsPyabaleBanks': () => this.router.navigate(['/admin/accountsPayable/banks']),
          'accountsPyabaleChecks': () => this.router.navigate(['/admin/accountsPayable/cheques']),
          'accountsPyabaleCheckDeliveries': () => this.router.navigate(['/admin/accountsPayable/checkDeliveries']),
          'accountsPyabaleReports': () => this.router.navigate(['/admin/accountsPayable/reports']),
        }

        if (this.modules.length > 0) {
          MODULE_TYPES[this.modules[0].name]();
        }

      }
    });

    this.store.dispatch( READ_BANK_ACCOUNTS() )
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

  searchModule(name: string): Boolean {
    return this.modules.find(m => m.name === name) ? true : false;
  }

}
