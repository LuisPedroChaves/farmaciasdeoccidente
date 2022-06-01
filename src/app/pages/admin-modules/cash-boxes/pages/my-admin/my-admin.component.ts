import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CashItem } from 'src/app/core/models/Cash';
import { CashService } from 'src/app/core/services/httpServices/cash.service';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-my-admin',
  templateUrl: './my-admin.component.html',
  styleUrls: ['./my-admin.component.scss']
})
export class MyAdminComponent implements OnInit, OnDestroy {

    /* #region  Header */
    @ViewChild('drawer') drawer: MatDrawer;

    drawerComponent = 'INDEPENDIENTE';
    title: string;
    cash: CashItem;
    typeNew: string;
    /* #endregion */

    loading = false;
    cashSubscription: Subscription;
    cashes: CashItem[];
    cashesPage: CashItem[];
    indexHovered = -1;

    sessionSubscription: Subscription;
    permissions: string[] = [];

  constructor(
    private cashService: CashService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.cashSubscription = this.cashService.getAdmin()
      .subscribe((data) => {
        this.cashes = data
        this.cashesPage = data
        this.loading = false
      });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'cashAdmin');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngOnDestroy(): void {
    this.cashSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }


  selectCash(cash: CashItem) {
    this.title = `${cash.type} | ${cash._user.name}`
    this.cash = cash;
    this.drawer.opened = true;
  }

  reset() {
    this.drawerComponent = 'INDEPENDIENTE';
    this.drawer.opened = false;
    this.cash = null;
  }

}
