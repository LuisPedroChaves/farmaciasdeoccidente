import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderItem } from '../../../../../core/models/Order';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-select-order',
  templateUrl: './select-order.component.html',
  styleUrls: ['./select-order.component.scss']
})
export class SelectOrderComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  selectedOrder: OrderItem;
  return = 'orders';
  loading = false;

  avatars = [
    { index: 0, image: '/assets/images/avatars/01.png' },
    { index: 1, image: '/assets/images/avatars/02.png' },
    { index: 2, image: '/assets/images/avatars/03.png' },
    { index: 3, image: '/assets/images/avatars/04.png' },
    { index: 4, image: '/assets/images/avatars/05.png' },
    { index: 5, image: '/assets/images/avatars/00M.jpg' },
    { index: 6, image: '/assets/images/avatars/00F.jpg' },
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.orderService.getOrder(params.id).subscribe(data => {
        this.selectedOrder = data.order;
      });
      this.return = params.return;
    });
  }

  getMinutes(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.round((((date2.getTime() - date1.getTime()) % 86400000) % 3600000) / 60000).toFixed(2);
  }

  getHours(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.floor(((date2.getTime() - date1.getTime()) % 86400000) / 3600000).toFixed(2);
  }

  getDays(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.floor((date2.getTime() - date1.getTime()) / 86400000).toFixed(2);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  delivery() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Entregar Orden', message: '¿Confirma que desea marcar la orden ' + this.selectedOrder.noOrder + ' como entregada?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.selectedOrder.state = 'ENTREGA';
          this.orderService.updateOrderState(this.selectedOrder).subscribe(data => {
            this.toasty.success('Orden entregada exitosamente');
            this.router.navigate(['/delivery']);
          }, error => {
            this.loading = false;
            this.toasty.error('Error al entregar la orden');
          });
        }
      }
    });
  }

  devolucion() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Devolver Orden', message: '¿Confirma que desea devolver la orden  ' + this.selectedOrder.noOrder + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;
        this.selectedOrder.textReturned = result;
        this.selectedOrder.state = 'DEVOLUCION';
        this.orderService.updateOrderState(this.selectedOrder).subscribe(data => {
          this.toasty.success('Orden marcada como devolución');
          this.router.navigate(['/delivery']);
        }, error => {
          this.loading = false;
          this.toasty.error('Error al devolver la orden');
        });
      }
    });
  }

}
