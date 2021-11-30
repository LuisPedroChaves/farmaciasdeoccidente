import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InternalOrderItemFull } from 'src/app/core/models/InternalOrder';
import { ProductAddedItem } from 'src/app/core/models/Product';
import { UserItem } from 'src/app/core/models/User';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent implements OnInit {
  @Input() smallScreen: boolean;
  @Input() ORDER: InternalOrderItemFull;
  @Output() saving = new EventEmitter<any>();
  @Input() delivers:  UserItem[] = [];

  dispatchProducts: ProductAddedItem[] = [];
  constructor(public dialog: MatDialog, public internalOrderService: InternalOrderService, public toasty: ToastyService, public printService: PrintService) { }

  ngOnInit(): void {}




  add(p: ProductAddedItem) {
    const exists = this.ORDER.detail.findIndex(pr => pr._product._id === p._product._id);
    if (exists > -1) {}  else {
      this.dispatchProducts.push({...p});
    }
  }
  remove(p: ProductAddedItem) {
    const exists = this.dispatchProducts.findIndex(pr => pr._product._id === p._product._id);
    if (exists > -1) {
      this.dispatchProducts.splice(exists, 1);
    }
  }


  dispatch() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Despachar Pedido', message: '¿Confirma que desea despachar el pedido  ' + this.ORDER.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ORDER.state = 'DESPACHO';
        this.ORDER.detail = [...this.dispatchProducts];
        this.internalOrderService.updateInternalOrderState(this.ORDER).subscribe(data => {
          this.toasty.success('Pedido despachado exitosamente');
          this.saving.emit(true);

        }, error => {
          this.toasty.error('Error al despachar el pedido');
        });
      }
    });
  }

  print() {

    const body = [];

    // ENCABEZADO
    body.push({
      style: 'subheader',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [[{
          layout: 'noBorders',
          table: {
            widths: ['*'],
            headerRows: 1,
            body: [
              [{ text: 'Farmacias de Occidente', style: 'header' }],
              [{ text: 'Dirección: ' + this.ORDER._cellar.address, style: 'text9' }],
              [{ text: 'Nit: 8838044-0', style: 'text9' }],
            ]
          }
        }], [{}]]
      },
      layout: 'headerLineOnly'
    });
    body.push({
      style: 'subheader',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          [
            {
              layout: 'noBorders',
              table: {
                widths: ['*'],
                headerRows: 1,
                body: [
                  [{ text: 'ORDEN DE DESPACHO', style: ['text11', 'boldtext'] }],
                  [{ text: 'No.' + this.ORDER.noOrder, style: ['text10'] }],
                  [{}],
                  [{ text: 'Fecha: ' + moment(this.ORDER.date).format('DD-MMM-YYYY hh:mm:ss'), style: ['text8'] }],
                  [{ text: 'Detalles: ' + this.ORDER.details, style: ['text8'] }],
                ]
              }
            }
          ], [{}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });

    const columns = [
      { text: 'Cantidad', style: ['cellHeader'] },
      { text: 'Producto', style: ['cellHeader'] },
      { text: 'Presentación', style: ['cellHeader'] },
      { text: 'Unidad', style: ['cellHeader'] },
    ];
    const array = [
      columns
    ];
    this.dispatchProducts.forEach(p => {
      const presentation = p._product.presentations as any;
      array.push([ p.quantity, p._product.description, presentation.name, p._product.unity ]);
    });
    body.push({
      style: 'cells',
      layout: 'headerLineOnly',
      table: {
        widths: ['auto', 'auto', 'auto', 'auto'],
        headerRows: 1,
        body: array
      }
    });
    body.push({ text: '\n' });
    body.push({
      style: 'cells',
      layout: 'noBorders',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          ['GRACIAS POR SU PREFERENCIA.       ____________________'],
          // ['DATOS DEL CERTIFICADOR: INFILE, SOCIEDAD ANONIMA - NIT 12521337'],
        ]
      }
    });




    body.push({ text: '', pageBreak: 'after' });




    // NEXT PAGE
    body.push({
      style: 'subheader',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [[{
          layout: 'noBorders',
          table: {
            widths: ['*'],
            headerRows: 1,
            body: [
              [{ text: 'Farmacias de Occidente', style: 'header' }],
              [{ text: 'Dirección: ' + this.ORDER._cellar.address, style: 'text9' }],
              [{ text: 'Nit: 8838044-0', style: 'text9' }],
            ]
          }
        }], [{}]]
      },
      layout: 'headerLineOnly'
    });
    body.push({
      style: 'subheader',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          [
            {
              layout: 'noBorders',
              table: {
                widths: ['*'],
                headerRows: 1,
                body: [
                  [{ text: 'ORDEN DE DESPACHO', style: ['text11', 'boldtext'] }],
                  [{ text: 'No.' + this.ORDER.noOrder, style: ['text10'] }],
                  [{}],
                  [{ text: 'Fecha: ' + moment(this.ORDER.date).format('DD-MMM-YYYY hh:mm:ss'), style: ['text8'] }],
                  [{ text: 'Detalles: ' + this.ORDER.details, style: ['text8'] }],
                ]
              }
            }
          ], [{}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });
    const array2 =[
      [
        { text: 'Cantidad', style: ['cellHeader'] },
        { text: 'Producto', style: ['cellHeader'] },
        { text: 'Presentación', style: ['cellHeader'] },
        { text: 'Unidad', style: ['cellHeader'] },
      ]
    ]

    this.dispatchProducts.forEach(p => {
      const presentation = p._product.presentations as any;
      array2.push([ p.quantity, p._product.description, presentation.name, p._product.unity ]);
    });
    body.push({
      style: 'cells',
      layout: 'headerLineOnly',
      table: {
        widths: ['auto', 'auto', 'auto', 'auto'],
        headerRows: 1,
        body: array2
      }
    });
    body.push({ text: '\n' });
    body.push({
      style: 'cells',
      layout: 'noBorders',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          ['GRACIAS POR SU PREFERENCIA.       ____________________'],
          // ['DATOS DEL CERTIFICADOR: INFILE, SOCIEDAD ANONIMA - NIT 12521337'],
        ]
      }
    });


    this.printService.print(body);
  }

}
