import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-check-deliveries',
  templateUrl: './check-deliveries.component.html',
  styleUrls: ['./check-deliveries.component.scss']
})
export class CheckDeliveriesComponent implements OnInit, OnDestroy {

  loading = false;
  checksTemp: CheckItem[] = [];
  checks: CheckItem[] = [];

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private checkService: CheckService,
    private filter: FilterPipe,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.checkService.getDeliveries()
      .subscribe(resp => {
        this.checksTemp = resp.checks;
        this.checks = resp.checks;
        this.loading = false;
      });

      this.sessionSubscription= this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
        if (session.permissions !== null) {
          const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleCheckDeliveries');
          this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
        }
    });
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }

  applyFilter(text: string) {
    this.checks = this.filter.transform(this.checksTemp, text, ['no', 'date', 'name', 'amount', 'note']);
  }

  getDelivered(_id: string): void {
    this.checksTemp = this.checksTemp.filter(c => c._id !== _id);
    this.checks = this.checks.filter(c => c._id !== _id);
  }

}
