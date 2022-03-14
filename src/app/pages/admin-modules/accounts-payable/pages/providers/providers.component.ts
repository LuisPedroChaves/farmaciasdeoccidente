import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { ProviderItem } from 'src/app/core/models/Provider';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';

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
    unaffectedAmount: 0,
    exemptAmount: 0,
    netPurchaseAmount: 0,
    netServiceAmount: 0,
    otherTaxes: 0,
    iva: 0,
    total: 0,
    type: 'PRODUCTOS',
    file: '',
    withholdingIVA: '',
    withholdingISR: '',
    toCredit: false,
    expirationCredit: null,
    paid: false,
  };
  /* #endregion */

  loading = false;
  providersSubscription: Subscription;
  providers: ProviderItem[];
  provider: ProviderItem;
  indexHovered = -1;

  constructor(
    private providerService: ProviderService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.providersSubscription = this.providerService.readData().subscribe((data) => {
      this.providers = data;
      this.loading = false
    });
  }

  ngAfterContentInit(): void {
    this.providerService.loadData();
  }

  ngOnDestroy(): void {
    this.providersSubscription?.unsubscribe();
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
    this.title = `${provider.nit} - ${provider.name}`
    this.provider = provider;
    this.drawer.opened = true;
  }
}
