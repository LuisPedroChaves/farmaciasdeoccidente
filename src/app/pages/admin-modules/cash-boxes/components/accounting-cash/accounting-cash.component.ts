import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CashItem } from 'src/app/core/models/Cash';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashFlowService } from 'src/app/core/services/httpServices/cash-flow.service';
import { CashRequisitionService } from 'src/app/core/services/httpServices/cash-requisition.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import * as actions from 'src/app/store/actions/accounting-cash.actions';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { CashRequisitionItem } from '../../../../../core/models/CashRequisition';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { AccountingCashStore } from 'src/app/store/reducers';

@Component({
  selector: 'app-accounting-cash',
  templateUrl: './accounting-cash.component.html',
  styleUrls: ['./accounting-cash.component.scss']
})
export class AccountingCashComponent implements OnInit, OnChanges, OnDestroy {

  @Input() currentCash: CashItem;
  @Input() isAdmin: boolean = false;
  @Input() permissions: string[] = [];
  @Output() close = new EventEmitter();

  accountingCashSubscription: Subscription;
  cashFlowSubscription: Subscription;
  displayedColumns: string[] = ['document', 'details', 'state', 'income', 'outflow', 'balance', 'actions'];
  dataSource = new MatTableDataSource<CashFlowItem>([]);

  totalPending = 0;
  pendingSource = new MatTableDataSource<CashFlowItem>([]);
  selection = new SelectionModel<CashFlowItem>(true, []);
  columns = [
    'select',
    'date',
    'document', 'details', 'state', 'income', 'outflow', 'balance', 'actions'
  ];

  totalRequisitions = 0;
  requisitionsSource = new MatTableDataSource<CashFlowItem>([]);
  requisitionsColumns = [
    'date',
    'document', 'details', 'state', 'income', 'outflow', 'balance', 'actions'
  ];

  /* #region  Historial */
  loading = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  displayedColumns2: string[] = ['date', 'document', 'details', 'state', 'income', 'outflow', 'balance'];
  dataSource2 = new MatTableDataSource<CashFlowItem>([]);
  /* #endregion */

  constructor(
    private cashFlowService: CashFlowService,
    private store: Store<AccountingCashStore>,
    private toastyService: ToastyService,
    private cashRequisitionService: CashRequisitionService,
    private printService: PrintService,
    private timeFormat: TimeFormatPipe,
  ) { }

  ngOnInit(): void {
    this.cashFlowSubscription = this.cashFlowService.readData().subscribe((data) => {
      this.dataSource = new MatTableDataSource<CashFlowItem>(data);
    });

    this.accountingCashSubscription = this.store.select('accountingCash')
      .subscribe(state => {
        this.totalPending = state.pendings.length
        this.pendingSource = new MatTableDataSource<CashFlowItem>(state.pendings);
        this.selection = new SelectionModel<CashFlowItem>(true, []);

        this.totalRequisitions = state.requisitions.length
        this.requisitionsSource = new MatTableDataSource<CashFlowItem>(state.requisitions)
      });

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentCash.currentValue) {
      this.cashFlowService.loadData(changes.currentCash.currentValue._id);
      this.store.dispatch(actions.READ_CASH_FLOWS({ idCash: changes.currentCash.currentValue._id, state: 'PENDIENTE' }))
      this.store.dispatch(actions.READ_CASH_FLOWS({ idCash: changes.currentCash.currentValue._id, state: 'REQUISICION' }))
    }
  }

  ngOnDestroy(): void {
    this.accountingCashSubscription?.unsubscribe();
  }

  createRequisition() {
    if (this.selection.selected.length === 0) {
      this.toastyService.error('No hay movimientos seleccionados')
      return
    }
    console.log(this.selection.selected);

    this.loading = true;
    const NEW_CASH_REQUISITION: CashRequisitionItem = {
      _cash: this.currentCash,
      _cashFlows: this.selection.selected,
      total: this.selection.selected.reduce((sum, item) => sum += item.expense, 0),
      paid: false
    }

    this.cashRequisitionService.create(NEW_CASH_REQUISITION)
      .subscribe(resp => {
        this.toastyService.success('Requisición creada correctamente')
        this.printReport(this.selection.selected)
        this.store.dispatch(actions.PENDINGS_TO_REQUSITIONS({ cashFlows: this.selection.selected }))
        this.loading = false
      })
  }

  history(startDate, endDate) {
    this.loading = true;
    this.cashFlowService.getHistory(startDate, endDate, this.currentCash._id)
      .subscribe(data => {
        this.dataSource2 = new MatTableDataSource<CashFlowItem>(data);
        this.loading = false;
      })
  }

  printReport(cashFlows: CashFlowItem[]) {
    const body = [];
    body.push({ text: 'GRUPO DE NEGOCIOS TEL S.A', style: ['header'] });
    body.push({ text: 'Empresa', style: ['subheader'] });
    body.push({ text: '\n' });

    const ArrayToPrint: any[] = [];
    const printColumns: any[] = [
      { text: 'FECHA', style: 'cellHeader' },
      { text: 'SERIE', style: 'cellHeader' },
      { text: 'NUMERO', style: 'cellHeader' },
      { text: 'DESCRIPCION', style: 'cellHeader' },
      { text: 'TOTAL', style: 'cellHeader' },
    ];
    ArrayToPrint.push(printColumns);

    const rowArray: any[] = [];
    cashFlows.forEach((c) => {
      const FORMAT_DATE = this.timeFormat.transform(
        c.date.toString(),
        'DD/MM/YYYY',
        'es'
      );
      const ROW: string[] = [
        FORMAT_DATE,
        c.serie,
        c.noBill,
        c.details,
        `Q ${c.expense.toFixed(2)}`,
      ];
      rowArray.push(ROW);
    });

    rowArray.forEach((row) => {
      ArrayToPrint.push(row);
    });

    body.push({
      style: 'cellMetrics',
      table: {
        widths: [
          '*',
          '*',
          '*',
          227,
          '*',
        ],
        headerRows: 1,
        body: ArrayToPrint,
      },
    });

    this.printService.printPortrait(body);
  }

  /* #region  SELECTION TABLE */

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.pendingSource.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; en caso contrario, borra la selección. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.pendingSource.data);
  }
  /* #endregion */

}
