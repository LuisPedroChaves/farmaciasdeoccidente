import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InternalOrderFullItem, InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  ORDER:InternalOrderFullItem;
  internalOrdersp: string[] = [];
  constructor(public dialogRef: MatDialogRef<OrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public internalOrderService: InternalOrderService, public toasty: ToastyService, public printService: PrintService) { }

  ngOnInit(): void {
    this.ORDER = this.data.order;
    this.internalOrdersp = this.data.internalOrdersp;
    console.log(this.ORDER);
  }



  print() {
    const body = [];
    body.push({ text: 'FARMACIAS DE OCCIDENTE S.A.\n', style: ['header'] });
    body.push({ text: 'Guía de Pedido', style: ['subheader'] });
    
    const ArrayToPrint: any[] = [
      [{ text: 'Bodega', style: 'cellHeader' }, { text: this.ORDER._cellar.name },  {text: 'No.', style: 'cellHeader' }, { text: this.ORDER.noOrder }],
      [{ text: 'Fecha', style: 'cellHeader' }, { text:moment( this.ORDER.date).format('DD/MM/YYYY HH:mm') },  {text: 'Despacho.', style: 'cellHeader' }, { text: moment( this.ORDER.timeDispatch ).format('DD/MM/YYYY HH:mm')}]
    ];
     if (this.ORDER._delivery ) {
      ArrayToPrint.push([{ text: 'Usuario', style: 'cellHeader' }, { text: this.ORDER._user.name}, { text: 'Repartidor', style: 'cellHeader' }, { text: this.ORDER._delivery.name}]);
    } else {
      
      ArrayToPrint.push([{ text: 'Usuario', style: 'cellHeader' }, { text: this.ORDER._user.name, colSpan: 3}, {}, {}]);
    }
    ArrayToPrint.push([{ text: 'Estado', style: 'cellHeader' }, { text: this.ORDER.state, colSpan: 3}, {}, {}]);
    ArrayToPrint.push([{ text: 'Detalles', style: 'cellHeader' }, { text: this.ORDER.details, colSpan: 3}, {}, {}]);
    const printColumns: any[] = [
      { text: 'Cantidad', style: 'cellHeader' },
      { text: 'Producto', style: 'cellHeader' },
      { text: 'Unidad', style: 'cellHeader' },
      { text: 'Stock', style: 'cellHeader' }
    ];

    ArrayToPrint.push(printColumns);
    if (this.ORDER.products) {
      this.ORDER.products.forEach(p => {
        ArrayToPrint.push([ p.quantity, p.product.description, p.product.unity, p.stock ]);
      });

    }
    body.push({
      style: 'cellMetrics',
      table: {
        widths: [ 'auto', '*','auto','auto'],
        headerRows: 1,
        body: ArrayToPrint,
      },
    });
    body.push({ text: '\n' });
    this.printService.print(body);
  }


  finish(internalOrder: InternalOrderFullItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Marcar como recibido', message: '¿Confirma que desea marcar como recibido el pedido  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        internalOrder.state = 'ENTREGA';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido aceptado exitosamente');
          this.dialogRef.close('RECIVED');
        }, error => {
          this.toasty.error('Error al aceptar el pedido');
        });
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
        this.internalOrderService.deleteInternalOrder(internalOrder).subscribe(data => {
          this.toasty.success('Pedido eliminado exitosamente');
          this.dialogRef.close('DELETE');
        }, error => {
          this.toasty.error('Error al eliminar el pedido');
        });
      }
    });
  }

}
