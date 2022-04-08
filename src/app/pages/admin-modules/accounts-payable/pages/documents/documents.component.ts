import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterContentInit, OnDestroy {

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
  accountsPayableSubscription: Subscription;
  accountsPayables: AccountsPayableItem[];

  /* #region  Lists */
  accountsPayablesReten: AccountsPayableItem[] = [];
  filterReten = '';

  accountsPayablesProd: AccountsPayableItem[] = [];
  filterProd = '';

  accountsPayablesGast: AccountsPayableItem[] = [];
  filterGast = '';

  accountsPayablesHistory: AccountsPayableItem[] = [];
  filterHistory = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  /* #endregion */

  constructor(
    private accountsPayableService: AccountsPayableService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
      console.log('SUBSCRIPTION');
      this.accountsPayables = data;
      this.accountsPayablesReten = this.accountsPayables.filter(ap => (ap._provider.iva && ap.emptyWithholdingIVA) || (ap._provider.isr && ap.emptyWithholdingISR))
      this.accountsPayablesProd = this.accountsPayables.filter(ap => ap.type === 'PRODUCTOS');
      this.accountsPayablesGast = this.accountsPayables.filter(ap => ap.type === 'GASTOS');
      this.loading = false
    });
    //Historial
    this.range.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      if (range.start && range.end) {
        this.history(range.start._d, range.end._d);
      }
    });
  }

  ngAfterContentInit(): void {
    this.accountsPayableService.loadData();
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
  }

  applyFilter(filter: string) {
    this.filterReten = filter
    this.filterProd = filter
    this.filterGast = filter
    this.filterHistory = filter
  }

  newDocument(type: string) {
    if (type === 'PRODUCTOS') {
      this.title = 'Nuevo documento de productos'
    } else {
      this.title = 'Nuevo documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable.type = type;
    this.drawer.opened = true;
  }

  getAccountPayable(accountsPayable: AccountsPayableItem) {
    this.accountsPayable = accountsPayable;
    this.title = `${accountsPayable.serie} -  ${accountsPayable.noBill}`
    if (accountsPayable.docType === 'FACTURA') {
      this.title += ' | Electrónica'
    }
    if (accountsPayable.docType === 'CAMBIARIA') {
      this.title += ' | Cambiaria electrónica'
    }
    if (accountsPayable.docType === 'PEQUEÑO') {
      this.title += ' | Pequeño contribuyente'
    }
    if (accountsPayable.docType === 'ABONO') {
      this.title += ' | Nota de abono'
    }
    if (accountsPayable.docType === 'CREDITO') {
      this.title += ' | Nota de crédito'
    }
    this.drawerComponent = 'CUENTA'
    this.drawer.opened = true;
  }

  reset(): void {
    this.drawer.opened = false;
    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable = {
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
  }

  reload() {
    this.drawer.opened = false;
    this.accountsPayableService.loadData();
  }

  history(startDate, endDate) {
    this.loading = true;
    this.accountsPayableService.getHistory(startDate, endDate)
      .subscribe(data => {
        this.accountsPayablesHistory = data;
        this.loading = false;
      })
  }

}
