import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {

  loading = false;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private accountsPayableService: AccountsPayableService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleReports');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

}
