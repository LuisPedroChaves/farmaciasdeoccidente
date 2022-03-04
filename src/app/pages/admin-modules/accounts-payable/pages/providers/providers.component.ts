import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {

  @ViewChild('drawer') drawer: MatDrawer;

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
    toCredit: false,
    expirationCredit: null,
    paid: false,
  };

  constructor() { }

  ngOnInit(): void {
  }

  newDocument(type: string) {
    if (type === 'PRODUCTOS') {
      this.title = 'Nuevo documento de productos'
    }else {
      this.title = 'Nuevo documento de gastos'
    }

    this.accountsPayable.type = type;
    this.drawer.opened = true;
  }

}
