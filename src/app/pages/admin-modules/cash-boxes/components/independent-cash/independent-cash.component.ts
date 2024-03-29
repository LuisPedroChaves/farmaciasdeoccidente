import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashFlowService } from 'src/app/core/services/httpServices/cash-flow.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CashItem } from '../../../../../core/models/Cash';

@Component({
  selector: 'app-independent-cash',
  templateUrl: './independent-cash.component.html',
  styleUrls: ['./independent-cash.component.scss']
})
export class IndependentCashComponent implements OnInit, OnDestroy, OnChanges {

  @Input() currentCash: CashItem;
  @Input() isAdmin: boolean = false;
  @Input() permissions: string[] = [];
  @Output() close = new EventEmitter();

  typeNew: string;

  cashFlowSubscription: Subscription;
  displayedColumns: string[] = ['details', 'state', 'income', 'outflow', 'balance', 'actions'];
  dataSource = new MatTableDataSource<CashFlowItem>([]);

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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cashFlowSubscription = this.cashFlowService.readData().subscribe((data) => {
      this.dataSource = new MatTableDataSource<CashFlowItem>(data);
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
    }
  }

  ngOnDestroy(): void {
    this.cashFlowSubscription?.unsubscribe();
  }

  getTotalPending(): number {
    return this.dataSource.data.filter(d => d.state === 'SOLICITADO' && d.expense > 0).length
  }

  history(startDate, endDate) {
    this.loading = true;
    this.cashFlowService.getHistory(startDate, endDate, this.currentCash._id)
      .subscribe(data => {
        this.dataSource2 = new MatTableDataSource<CashFlowItem>(data);
        this.loading = false;
      })
  }

  acceptAll(): void {
    /* #region  Validaciones */
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: `Aprobar ${this.getTotalPending()} solicitudes`, message: '¿Confirma que desea aprobar todas las solicitudes?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;
        this.dataSource.data.filter(d => d.state === 'SOLICITADO' && d.expense > 0).map(async (data) => {
          data.state = 'APROBADO';
          await this.cashFlowService.update(data).subscribe();
        })
        this.toastyService.success('Egresos aprobados exitosamente');
        // this.cashFlowService.loadData(this.currentCash._id);
        this.loading = false;
      }
    });
  }

  rejectCashFlow(cashFlow: CashFlowItem): void {
    /* #region  Validaciones */
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    cashFlow.state = 'RECHAZADO';
    this.loading = true;
    this.cashFlowService.update(cashFlow)
      .subscribe(resp => {
        this.toastyService.success('Egreso rechazado exitosamente');
        this.currentCash.balance = resp.balance;
        this.cashFlowService.loadData(this.currentCash._id);
        this.loading = false;
      })
  }

}
