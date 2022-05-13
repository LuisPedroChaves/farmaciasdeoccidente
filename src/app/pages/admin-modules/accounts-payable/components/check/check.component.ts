import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
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

  constructor(
    public checkService: CheckService,
    private toastyService: ToastyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  delivery(check: CheckItem): void {
    if (this.permissions && !this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Entregar cheque',
        message:
          '¿Confirma que desea entregar el cheque:  ' +
          check.no +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        check.delivered = true;
        this.checkService.updateState(check)
          .subscribe(resp => {
            this.toastyService.success('Cheque entregado exitosamente')
            this.sendId.emit(check._id)
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
        check.state = state;

        this.checkService.updateState(check)
          .subscribe(resp => {
            this.toastyService.success('Cheque actualizado exitosamente')
            const { state, paymentDate, receipt, delivered } = resp.check;
            this.check.state = state;
            this.check.paymentDate = paymentDate;
            this.check.receipt = receipt;
            this.check.delivered = delivered;
            this.checkService.loadData();
          })
      }
    });
  }

  pay(check: CheckItem, state: string): void {
    if (this.permissions && !this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return;
    }
    const dialogRef = this.dialog.open(EnterPaymentComponent, {
      width: '350px',
      data: {
        message:
          '¿Confirma que desea actualizar el cheque:  ' +
          check.no +
          '?',
        check
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        check.state = state;
        check.receipt.no = result;

        this.checkService.updateState(check)
          .subscribe(resp => {
            this.toastyService.success('Cheque actualizado exitosamente')
            const { state, paymentDate, receipt, delivered } = resp.check;
            this.check.state = state;
            this.check.paymentDate = paymentDate;
            this.check.receipt = receipt;
            this.check.delivered = delivered;
            this.checkService.loadData();
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
        check.voided = true;
        this.checkService.updateState(check)
          .subscribe(resp => {
            this.toastyService.success('Cheque anulado exitosamente')
            this.sendId.emit(check._id)
            this.checkService.loadData();
          })
      }
    });
  }

}
