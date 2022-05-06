import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { switchMap } from 'rxjs/operators';

import { AccountsPayableBalanceItem, AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.scss']
})
export class AccountsPayableComponent implements OnInit, OnChanges {

  @Input()
  accountsPayable: AccountsPayableItem;
  @Input()
  permissions: string[] = [];
  @Output()
  return = new EventEmitter();
  @Output()
  sendAmount = new EventEmitter();
  @Output()
  sendEdit = new EventEmitter();

  form = new FormGroup({
    date: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    credit: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
  });
  loading = false;

  displayedColumns: string[] = ['check', 'date', 'document', 'credit', 'amount', 'actions'];
  dataSource = new MatTableDataSource([]);

  displayedColumns2: string[] = ['check', 'date', 'document', 'credit', 'amount'];
  dataSource2 = new MatTableDataSource([]);

  constructor(
    private accountsPayableService: AccountsPayableService,
    private toastyService: ToastyService,
    private providerService: ProviderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsPayable) {
      this.dataSource = new MatTableDataSource<AccountsPayableBalanceItem>(changes.accountsPayable.currentValue.balance);
      this.dataSource2 = new MatTableDataSource<AccountsPayableBalanceItem>(changes.accountsPayable.currentValue.deletedBalance);
    }
  }

  expired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date();
  }

  getTotalAfecto(): number {
    return +this.accountsPayable.netPurchaseAmount +
      +this.accountsPayable.netServiceAmount +
      +this.accountsPayable.iva;
  }

  enterRetention() {
    /* #region  Validaciones */
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    if (this.form.controls.credit.value === 'RETENCION_IVA') {
      this.accountsPayable.emptyWithholdingIVA = false;
    }
    if (this.form.controls.credit.value === 'RETENCION_ISR') {
      this.accountsPayable.emptyWithholdingISR = false;
    }
    /* #endregion */
    this.loading = true;
    const AMOUNT = this.form.controls.amount.value;

    this.accountsPayable.balance.push({ ...this.form.value })
    this.accountsPayableService.update(this.accountsPayable)
      .pipe(
        switchMap(({ resp }) => this.providerService.updateBalance({
          _provider: this.accountsPayable._provider._id,
          amount: AMOUNT,
          action: 'RESTA'
        }))
      )
      .subscribe(resp => {
        this.toastyService.success('Retención ingresada exitosamente');
        this.dataSource = new MatTableDataSource<AccountsPayableBalanceItem>(this.accountsPayable.balance);
        this.accountsPayableService.loadData();
        this.form.reset({
          credit: ''
        });
        this.sendAmount.emit(-AMOUNT);
        this.loading = false;
      })
  }

  nullRetention(balance: AccountsPayableBalanceItem): void {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }

    const CHECK = this.accountsPayable.balance.find(b => b._check);
    if (CHECK) {
      this.toastyService.error('Error de anulación', 'Este documento ya está enlazado a un cheque, por favor anule primero el cheque');
      return
    }

    if (balance.credit === 'RETENCION_IVA') {
      this.accountsPayable.emptyWithholdingIVA = true;
    }
    if (balance.credit === 'RETENCION_ISR') {
      this.accountsPayable.emptyWithholdingISR = true;
    }
    /* #endregion */
    this.loading = true;

    const INDEX = this.accountsPayable.balance.findIndex(b => b._id === balance._id);

    if (INDEX > -1) {
      this.accountsPayable.balance.splice(INDEX, 1);
      this.accountsPayable.deletedBalance.push(balance)
      this.accountsPayableService.update(this.accountsPayable)
        .pipe(
          switchMap(({ resp }) => this.providerService.updateBalance({
            _provider: this.accountsPayable._provider._id,
            amount: balance.amount,
            action: 'SUMA'
          }))
        )
        .subscribe(resp => {
          this.toastyService.success('Retención eliminada exitosamente');
          this.dataSource = new MatTableDataSource<AccountsPayableBalanceItem>(this.accountsPayable.balance);
          this.dataSource2 = new MatTableDataSource<AccountsPayableBalanceItem>(this.accountsPayable.deletedBalance);
          this.accountsPayableService.loadData();
          this.sendAmount.emit(+balance.amount);
          this.loading = false;
        })
    }
  }

  delete() {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }

    if (this.accountsPayable.balance.length > 0) {
      this.toastyService.error('Error de anulación', 'Este documento ya cuenta con abonos');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Anular Documento', message: '¿Confirma que desea anular el documento No.  ' + this.accountsPayable.noBill + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;

        this.accountsPayableService.delete(this.accountsPayable, result)
          .pipe(
            switchMap(({ resp }) => this.providerService.updateBalance({
              _provider: this.accountsPayable._provider._id,
              amount: this.accountsPayable.total,
              action: 'RESTA'
            }))
          )
          .subscribe(resp => {
            this.toastyService.success('Documento eliminado exitosamente');
            this.accountsPayableService.loadData();
            this.sendAmount.emit(-this.accountsPayable.total);
            this.loading = false;
            this.return.emit();
          })
      }
    });
  }
}
