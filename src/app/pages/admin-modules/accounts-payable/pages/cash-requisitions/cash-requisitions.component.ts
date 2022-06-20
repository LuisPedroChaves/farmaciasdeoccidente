import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { CashRequisitionItem } from 'src/app/core/models/CashRequisition';
import { CashRequisitionService } from 'src/app/core/services/httpServices/cash-requisition.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { READ_CASH_REQUISITIONS } from 'src/app/store/actions';
import { AccountsPayableStore } from 'src/app/store/reducers';
import { SET_CASH_FLOWS } from '../../../../../store/actions/accounts-payable.actions';

@Component({
  selector: 'app-cash-requisitions',
  templateUrl: './cash-requisitions.component.html',
  styleUrls: ['./cash-requisitions.component.scss']
})
export class CashRequisitionsComponent implements OnInit, OnDestroy {

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


  @ViewChild('drawer2') drawer2: MatDrawer;
  accountsPayableStore: Subscription

  requisitions: CashRequisitionItem[] = [];
  requisitionsSource = new MatTableDataSource([]);
  selection = new SelectionModel<CashRequisitionItem>(true, []);
  columns = [
    'select',
    '_cash',
    'created',
    'total',
    'actions',
  ];

  process: CashRequisitionItem[] = [];
  processSource = new MatTableDataSource([]);
  columns2 = [
    '_check',
    '_cash',
    'updated',
    'total',
    'actions',
  ];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  historySource = new MatTableDataSource([])

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private store: Store<AccountsPayableStore>,
    private toastyService: ToastyService,
    private cashRequisitionService: CashRequisitionService,
  ) { }

  ngOnInit(): void {

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleCashRequisitions');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });

    this.accountsPayableStore = this.store.select('accountsPayable')
      .subscribe(state => {
        this.requisitions = state.requisitions.filter(r => r._check === null)
        this.requisitionsSource = new MatTableDataSource<CashRequisitionItem>(this.requisitions);
        this.selection = new SelectionModel<CashRequisitionItem>(true, []);
        this.process = state.requisitions.filter(r => r._check !== null)
        this.processSource = new MatTableDataSource<CashRequisitionItem>(this.process);
      })

    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.history(range.start._d, range.end._d);
        }
      });

    this.store.dispatch(READ_CASH_REQUISITIONS())

  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
    this.accountsPayableStore?.unsubscribe();
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

  reset() {
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
  }

  applyFilter(filter: string) {
    console.log("🚀 ~ file: cash-requisitions.component.ts ~ line 124 ~ CashRequisitionsComponent ~ applyFilter ~ filter", filter)
  }

  /* #region  Label's */
  labelRequisitions(): string {
    return `Requisiciones (${this.requisitions.length})`
  }

  labelProcess(): string {
    return `En Proceso (${this.process.length})`
  }
  /* #endregion */

  getTotalSelection(): number {
    return this.selection.selected.reduce((sum, item) => sum += item.total, 0)
  }

  newPay() {
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return
    }
    if (this.selection.selected.length === 0) {
      this.toastyService.toasty('warning', 'Ninguna requisición seleccionada', 'Por favor seleccione las requisiciones a pagar')
      return;
    }
    this.drawer2.opened = true
  }

  closePay() {
    this.drawer2.opened = false
    this.store.dispatch(READ_CASH_REQUISITIONS())
  }

  viewCashFlows(cashRequisition: CashRequisitionItem) {
    this.title = `Revisión de gastos - ${cashRequisition._cash._user.name}`
    this.drawerComponent = 'GASTOS'
    this.store.dispatch(SET_CASH_FLOWS({ cashFlows: cashRequisition._cashFlows }))
    this.drawer.opened = true;
  }

  history(startDate: Moment, endDate: Moment): void {
    this.cashRequisitionService.readHistory(startDate, endDate)
      .subscribe(cashRequisitions => {
      console.log("🚀 ~ file: cash-requisitions.component.ts ~ line 231 ~ CashRequisitionsComponent ~ history ~ cashRequisitions", cashRequisitions)
        this.historySource = new MatTableDataSource<CashRequisitionItem>(cashRequisitions)
      })
  }

  /* #region  SELECTION TABLE */

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.requisitionsSource.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; en caso contrario, borra la selección. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.requisitionsSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: CashRequisitionItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.total + 1}`;
  }
  /* #endregion */
}
