import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { NewInternalOorderComponent } from '../new-internal-oorder/new-internal-oorder.component';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { InternalOrderService } from '../../../../../core/services/httpServices/internal-order.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  expanded = true;

enviados: InternalOrderItem[];
recibidos: InternalOrderItem[];
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
    this.internalOrderService.getOutgoing(this.currentCellar._id, 'PEDIDO').subscribe(data => {
      this.enviados = data.internalOrders.filter(order => order.state !== 'DESPACHO');
      this.recibidos = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }

  finish(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Marcar como reibido', message: '¿Confirma que desea marcar como recibido el pedido  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        internalOrder.state = 'ENTREGA';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido aceptado exitosamente');
          this.loadInternalsOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al aceptar el pedido');
        });
      }
    });
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewInternalOorderComponent, {
      width: this.smallScreen ? '100%' : '600px',
      data: { currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadInternalsOrders();
      }
    });
  }

  delete(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Pedido', message: '¿Confirma que desea eliminar el pedido  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        this.internalOrderService.deleteInternalOrder(internalOrder).subscribe(data => {
          this.toasty.success('Pedido eliminado exitosamente');
          this.loadInternalsOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar el pedido');
        });
      }
    });
  }

}
