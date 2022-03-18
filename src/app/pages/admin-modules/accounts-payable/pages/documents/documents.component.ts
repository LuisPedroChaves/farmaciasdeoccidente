import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

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
      _check: null,
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
      amountIVA: 0,
      withholdingISR: '',
      amountISR: 0,
      toCredit: false,
      expirationCredit: null,
      paid: false,
    };
    /* #endregion */
  loading = false;
  dataSource = new MatTableDataSource([]);
  columns = [
    'date',
    'noBill',
    'docType',
    'unaffectedAmount',
    'exemptAmount',
    'netPurchaseAmount',
    'netServiceAmount',
    'otherTaxes',
    'iva',
    'total',
    'expirationCredit',
  ];

  constructor() { }

  ngOnInit(): void {
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

}
