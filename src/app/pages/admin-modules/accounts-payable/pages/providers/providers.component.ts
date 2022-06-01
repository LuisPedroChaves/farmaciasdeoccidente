import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ProviderItem } from 'src/app/core/models/Provider';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { AppState } from 'src/app/store/app.reducer';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { FilterPipe } from '../../../../../core/shared/pipes/filterPipes/filter.pipe';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit, AfterContentInit, OnDestroy {

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
  providersSubscription: Subscription;
  providers: ProviderItem[];
  providersPage: ProviderItem[];
  provider: ProviderItem;
  indexHovered = -1;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private providerService: ProviderService,
    private filter: FilterPipe,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.providersSubscription = this.providerService.readData().subscribe((data) => {
      this.providers = data.filter(p => p.balance > 0);
      this.providersPage = this.providers;
      this.loading = false
    });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleProviders');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngAfterContentInit(): void {
    this.providerService.loadData();
  }

  ngOnDestroy(): void {
    this.providersSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

  applyFilter(text: string) {
    this.providersPage = this.filter.transform(this.providers, text, ['nit', 'name']);
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

  selectProvider(provider: ProviderItem) {
    this.drawerComponent = 'PROVEEDOR'
    this.title = `${provider.nit} | ${provider.name}`
    this.provider = provider;
    this.drawer.opened = true;
  }

  getAccountsPayable(accountsPayable: AccountsPayableItem): void {
    this.drawerComponent = 'CUENTA'
    this.accountsPayable = accountsPayable;
  }

  getAmount(amount: number): void {
    this.provider.balance += amount;
  }

  reset() {
    this.drawerComponent = 'DOCUMENTO';
    this.drawer.opened = false;
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
    this.providerService.loadData();
  }
}
