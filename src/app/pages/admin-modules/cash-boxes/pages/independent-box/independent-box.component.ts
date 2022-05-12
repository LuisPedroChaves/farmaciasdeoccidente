import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CashItem } from 'src/app/core/models/Cash';
import { CashService } from 'src/app/core/services/httpServices/cash.service';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-independent-box',
  templateUrl: './independent-box.component.html',
  styleUrls: ['./independent-box.component.scss']
})
export class IndependentBoxComponent implements OnInit, OnDestroy {

  cashSubscription: Subscription;
  currentCash: CashItem;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private cashService: CashService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.cashSubscription = this.cashService.getUser('INDEPENDIENTE')
      .subscribe(cash => {
        this.currentCash = cash
      });

      this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
        if (session.permissions !== null) {
          const MODULOS = session.permissions.filter(pr => pr.name === 'cashIndependentBox');
          this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
        }
      });
  }

  ngOnDestroy() {
    this.cashSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

}
