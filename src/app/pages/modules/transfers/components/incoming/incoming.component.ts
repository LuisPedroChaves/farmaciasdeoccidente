import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  expanded = true;

  pendientes: InternalOrderItem[];
  enProceso: InternalOrderItem[];
  enRuta: InternalOrderItem[];
  currentCellar: CellarItem;

  constructor(
    public dialog: MatDialog,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadInternalsOrders();
  }


  loadInternalsOrders() {
    this.loading = true;
    this.internalOrderService.getIncoming(this.currentCellar._id, 'TRASLADO').subscribe(data => {
      this.pendientes = data.internalOrders.filter(order => order.state === 'ENVIO');
      this.enProceso = data.internalOrders.filter(order => order.state === 'CONFIRMACION');
      this.enRuta = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }

  accept(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Aceptar Traslado', message: '¿Confirma que desea aceptar el traslado  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        internalOrder.state = 'CONFIRMACION';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Traslado aceptado exitosamente');
          this.loadInternalsOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al aceptar el traslado');
        });
      }
    });
  }

  reject(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Rechazar Traslado', message: '¿Confirma que desea rechazar el traslado  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        internalOrder.state = 'RECHAZO';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Traslado rechazado exitosamente');
          this.loadInternalsOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al rechazar el traslado');
        });
      }
    });
  }

  dispatch(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Despachar Traslado', message: '¿Confirma que desea despachar el traslado  ' + internalOrder.noOrder + '?', isDelivery: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result !== null) {
          internalOrder._delivery = result;
        }
        // this.loading = true;
        internalOrder.state = 'DESPACHO';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Traslado despachado exitosamente');
          this.loadInternalsOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al despachar el traslado');
        });
      }
    });
  }

}
