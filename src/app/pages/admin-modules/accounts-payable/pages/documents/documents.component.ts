import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { AppState } from 'src/app/store/app.reducer';

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
    deletedBalance: [],
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
    additionalDiscount: false,
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

  accountsPayablesTemp: AccountsPayableItem[] = [];
  filterTemp = '';

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

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private accountsPayableService: AccountsPayableService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountsPayableService.getTempCredits()
      .subscribe(data => this.accountsPayablesTemp = data);

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

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleDocuments');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngAfterContentInit(): void {
    this.accountsPayableService.loadData();
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

  applyFilter(filter: string) {
    this.filterReten = filter
    this.filterTemp = filter
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

  editDocument(accountsPayable: AccountsPayableItem) {
    if (accountsPayable.type === 'PRODUCTOS') {
      this.title = 'Editar documento de productos'
    } else {
      this.title = 'Editar documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable = accountsPayable;
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
    if (accountsPayable.docType === 'CREDITO_TEMP') {
      this.title += ' | Nota de crédito (Temporal)'
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
      deletedBalance: [],
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
      additionalDiscount: false,
      toCredit: false,
      expirationCredit: null,
      paid: false,
    };
  }

  reload() {
    this.drawer.opened = false;
    this.accountsPayableService.loadData();
    this.accountsPayableService.getTempCredits()
      .subscribe(data => this.accountsPayablesTemp = data);
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
