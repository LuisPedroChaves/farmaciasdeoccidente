import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { CashItem } from 'src/app/core/models/Cash';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { CashFlowService } from 'src/app/core/services/httpServices/cash-flow.service';
import { CashService } from 'src/app/core/services/httpServices/cash.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

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

  cashFlowSubscription: Subscription;
  displayedColumns: string[] = ['details', 'state', 'income', 'outflow', 'balance', 'actions'];
  dataSource = new MatTableDataSource<CashFlowItem>([]);

  accountsPayableSubscription: Subscription;
  dataSource3 = new MatTableDataSource([]);
  selection = new SelectionModel<AccountsPayableItem>(true, []);
  columns = [
    'select',
    'state',
    'date',
    'noBill',
    '_provider',
    'total',
    'expirationCredit',
  ];

  /* #region  Historial */
  loading = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  displayedColumns2: string[] = ['date', 'details', 'state', 'income', 'outflow', 'balance'];
  dataSource2 = new MatTableDataSource<CashFlowItem>([]);
  /* #endregion */

  constructor(
    private cashFlowService: CashFlowService,
    private toastyService: ToastyService,
    private cashService: CashService,
    private dialog: MatDialog,
    private accountsPayableService: AccountsPayableService
  ) { }

  ngOnInit(): void {
    this.cashFlowSubscription = this.cashFlowService.readData().subscribe((data) => {
      this.dataSource = new MatTableDataSource<CashFlowItem>(data);
    });

    this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
      this.dataSource3 = new MatTableDataSource<AccountsPayableItem>(data.filter(ap => ap.type === 'GASTOS'));
      this.selection = new SelectionModel<AccountsPayableItem>(true, []);
      this.loading = false
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
      this.accountsPayableService.loadData();
    }
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
  }

  /* #region  Gets */
  getWithholdings(account: AccountsPayableItem): boolean {
    return (account._provider.iva && account.emptyWithholdingIVA) || (account._provider.isr && account.emptyWithholdingISR)
  }

  getExpired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date()
  }
  /* #endregion */

  history(startDate, endDate) {
    this.loading = true;
    this.cashFlowService.getHistory(startDate, endDate, this.currentCash._id)
      .subscribe(data => {
        this.dataSource2 = new MatTableDataSource<CashFlowItem>(data);
        this.loading = false;
      })
  }

  delete() {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Caja', message: '¿Confirma que desea eliminar la caja de  ' + this.currentCash._user.name + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;

        this.cashService.delete(this.currentCash, result)
          .subscribe(resp => {
            this.toastyService.success('Caja eliminada exitosamente');
            this.cashService.loadData();
            this.loading = false;
            this.close.emit();
          })
      }
    });
  }

  /* #region  SELECTION TABLE */

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource3.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; en caso contrario, borra la selección. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource3.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AccountsPayableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.total + 1}`;
  }
  /* #endregion */

}
