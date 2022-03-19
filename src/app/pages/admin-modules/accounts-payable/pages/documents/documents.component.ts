import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';

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
  accountsPayableSubscription: Subscription;
  accountsPayables: AccountsPayableItem[];

  /* #region  Retenciones */
  dataSource = new MatTableDataSource([]);
  columns = [
    'state',
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
  accountsPayablesReten: AccountsPayableItem[] = [];
  /* #endregion */

    /* #region  Productos */
    dataSource2 = new MatTableDataSource([]);
    columns2 = [
      'check',
      'state',
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
    accountsPayablesProd: AccountsPayableItem[] = [];
    /* #endregion */

      /* #region  Gastos */
  dataSource3 = new MatTableDataSource([]);
  columns3 = [
    'check',
    'state',
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
  accountsPayablesGast: AccountsPayableItem[] = [];
  /* #endregion */

  constructor(
    private accountsPayableService: AccountsPayableService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
      console.log('SUBSCRIPTION');
      this.accountsPayables = data;
      this.accountsPayablesReten = this.accountsPayables.filter(ap => (ap._provider.iva && !ap.withholdingIVA) || (ap._provider.isr && !ap.withholdingISR))
      this.accountsPayablesProd = this.accountsPayables.filter(ap => ap.type === 'PRODUCTOS');
      this.accountsPayablesGast = this.accountsPayables.filter(ap => ap.type === 'GASTOS');
      this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayablesReten);
      this.dataSource2 = new MatTableDataSource<AccountsPayableItem>(this.accountsPayablesProd);
      this.dataSource3 = new MatTableDataSource<AccountsPayableItem>(this.accountsPayablesGast);
      this.loading = false
    });
  }

  ngAfterContentInit(): void {
    this.accountsPayableService.loadData();
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
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
