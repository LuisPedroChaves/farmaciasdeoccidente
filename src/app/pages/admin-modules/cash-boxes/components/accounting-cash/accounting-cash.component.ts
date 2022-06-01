import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
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
import { AppAccountingCash } from 'src/app/store/reducers';
import * as actions from 'src/app/store/actions/accountingCash.actions';
import { CashRequisitionItem } from '../../../../../core/models/CashRequisition';

@Component({
  selector: 'app-accounting-cash',
  templateUrl: './accounting-cash.component.html',
  styleUrls: ['./accounting-cash.component.scss']
})
export class AccountingCashComponent implements OnInit, OnChanges {

  @Input() currentCash: CashItem;
  @Input() isAdmin: boolean = false;
  @Input() permissions: string[] = [];
  @Output() close = new EventEmitter();

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
    private store: Store<AppAccountingCash>,
    private toastyService: ToastyService,
    private cashRequisitionService: CashRequisitionService
  ) { }

  ngOnInit(): void {
    this.cashFlowSubscription = this.cashFlowService.readData().subscribe((data) => {
      this.dataSource = new MatTableDataSource<CashFlowItem>(data);
    });

    this.store.select('AccountingCash')
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
