import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { FilterPipe } from '../../../../../core/shared/pipes/filterPipes/filter.pipe';

@Component({
  selector: 'app-cheques',
  templateUrl: './cheques.component.html',
  styleUrls: ['./cheques.component.scss']
})
export class ChequesComponent implements OnInit, AfterContentInit, OnDestroy {

  /* #region  Header */
  @ViewChild('drawer') drawer: MatDrawer;

  drawerComponent = 'DOCUMENTO';
  title: string;
  accountsPayable: AccountsPayableItem = {
    _id: null,
    _user: null,
    _provider: null,
    _purchase: null,
    _expense: null,
    date: null,
    serie: '',
    noBill: '',
    docType: '',
    balance: [],
    unaffectedAmount: 0,
    exemptAmount: 0,
    netPurchaseAmount: 0,
    netServiceAmount: 0,
    otherTaxes: 0,
    iva: 0,
    total: 0,
    type: 'PRODUCTOS',
    file: '',
    emptyWithholdingIVA: false,
    emptyWithholdingISR: false,
    toCredit: false,
    expirationCredit: null,
    paid: false,
  };
  /* #endregion */
  loading = false;
  checkSubscription: Subscription;
  checksToday: CheckItem[] = [];
  checksTodayTemp: CheckItem[] = [];
  checksCreated: CheckItem[] = [];
  checksCreatedTemp: CheckItem[] = [];
  checksInter: CheckItem[] = [];
  checksInterTemp: CheckItem[] = [];
  checksWait: CheckItem[] = [];
  checksWaitTemp: CheckItem[] = [];
  checksAuth: CheckItem[] = [];
  checksAuthTemp: CheckItem[] = [];

  /* #region  Historial */
  checksHistory: CheckItem[] = [];
  checksHistoryTemp: CheckItem[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  /* #endregion */

  constructor(
    private checkService: CheckService,
    private filter: FilterPipe
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.checkService.getToday()
      .subscribe(resp => {
        this.checksTodayTemp = resp.checks;
        this.checksToday = resp.checks;
        this.loading = false;
      });

    this.checkSubscription = this.checkService.readData().subscribe((data) => {
      this.checksCreatedTemp = data.filter(d => d.state === "CREADO");
      this.checksCreated = this.checksCreatedTemp;
      this.checksInterTemp = data.filter(d => d.state === "INTERBANCO");
      this.checksInter = this.checksInterTemp;
      this.checksWaitTemp = data.filter(d => d.state === "ESPERA");
      this.checksWait = this.checksWaitTemp;
      this.checksAuthTemp = data.filter(d => d.state === "AUTORIZADO");
      this.checksAuth = this.checksAuthTemp;
      this.loading = false
    });

    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.getHistory(range.start._d, range.end._d);
        }
      });
  }

  ngAfterContentInit(): void {
    this.checkService.loadData();
  }

  ngOnDestroy(): void {
    this.checkSubscription?.unsubscribe();
  }

  applyFilter(text: string): void {
    this.checksToday = this.filter.transform(this.checksTodayTemp, text, ['no', 'date', 'name', 'amount', 'note']);
    this.checksCreated = this.filter.transform(this.checksCreatedTemp, text, ['no', 'date', 'name', 'amount', 'note']);
    this.checksInter = this.filter.transform(this.checksInterTemp, text, ['no', 'date', 'name', 'amount', 'note']);
    this.checksWait = this.filter.transform(this.checksWaitTemp, text, ['no', 'date', 'name', 'amount', 'note']);
    this.checksAuth = this.filter.transform(this.checksAuthTemp, text, ['no', 'date', 'name', 'amount', 'note']);
    this.checksHistory = this.filter.transform(this.checksHistoryTemp, text, ['no', 'date', 'name', 'amount', 'note']);
  }

  newDocument(type: string): void {
    if (type === 'PRODUCTOS') {
      this.title = 'Nuevo documento de productos'
    } else {
      this.title = 'Nuevo documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable.type = type;
    this.drawer.opened = true;
  }

  getVoided(_id: string): void {
    this.checksTodayTemp = this.checksTodayTemp.filter(c => c._id !== _id);
    this.checksToday = this.checksToday.filter(c => c._id !== _id);
  }

  getHistory(startDate, endDate): void {
    this.loading = true;
    this.checkService.getHistory(startDate, endDate)
      .subscribe(data => {
        this.checksHistory = data;
        this.loading = false;
      })
  }

}
