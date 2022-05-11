import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CashItem } from 'src/app/core/models/Cash';
import { CashService } from 'src/app/core/services/httpServices/cash.service';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-accounting-box',
  templateUrl: './accounting-box.component.html',
  styleUrls: ['./accounting-box.component.scss']
})
export class AccountingBoxComponent implements OnInit {

  cashSubscription: Subscription;
  currentCash: CashItem;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private cashService: CashService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.cashSubscription = this.cashService.getUser('CONTABLE')
    .subscribe(cash => {
      this.currentCash = cash
    });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'cashAccountingBox');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngOnDestroy() {
    this.cashSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

}
