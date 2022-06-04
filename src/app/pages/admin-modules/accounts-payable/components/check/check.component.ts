import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { READ_CHECKS_TODAY } from 'src/app/store/actions';
import { CheckStore } from 'src/app/store/reducers';
import { EnterPaymentComponent } from '../enter-payment/enter-payment.component';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

  @Input()
  i: number;
  @Input()
  check: CheckItem;
  @Input()
  isDelivery = false;
  @Input()
  permissions: string[] = [];
  @Output()
  sendId = new EventEmitter();

  indexHovered = -1;

  newDate = new FormControl();

  constructor(
    private store: Store<CheckStore>,
    public checkService: CheckService,
    private toastyService: ToastyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.newDate.valueChanges
      .subscribe(date => {
        this.check = {
          ...this.check,
          date
        }
      })
  }

  delivery(check: CheckItem): void {
    if (this.permissions && !this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return;
    }
    const dialogRef = this.dialog.open(EnterPaymentComponent, {
      width: '350px',
      data: {
        message:
          '¿Confirma que desea entregar el cheque:  ' +
          check.no +
          '?',
        check
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        check.delivered = true;
        check.receipt.no = result.noReceipt;
        check.receipt.name = result.name;

        this.checkService.updateState(check)
          .subscribe(check => {
            this.toastyService.success('Cheque entregado exitosamente')
            this.sendId.emit(check._id)
            this.store.dispatch(READ_CHECKS_TODAY())
          })
      }
    });
  }

  update(check: CheckItem, state: string, action: string): void {
    if (this.permissions && !this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: `${action} cheque`,
        message:
          '¿Confirma que desea actualizar el cheque:  ' +
          check.no +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {

        this.checkService.updateState({
          ...check,
          state
        })
          .subscribe(check => {
            this.toastyService.success('Cheque actualizado exitosamente')
            const { state, paymentDate, receipt, delivered } = check;
            this.check = {
              ...this.check,
              state,
              paymentDate,
              receipt,
              delivered
            }
            this.checkService.loadData();
            this.store.dispatch(READ_CHECKS_TODAY())
          })
      }
    });
  }

  void(check: CheckItem): void {
    if (this.permissions && !this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Anular cheque',
        message:
          '¿Confirma que desea anular el cheque:  ' +
          check.no +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.checkService.updateState({
          ...check,
          voided: true
        })
          .subscribe(resp => {
            this.toastyService.success('Cheque anulado exitosamente')
            this.sendId.emit(check._id)
            this.checkService.loadData();
            this.store.dispatch(READ_CHECKS_TODAY())
          })
      }
    });
  }

}
