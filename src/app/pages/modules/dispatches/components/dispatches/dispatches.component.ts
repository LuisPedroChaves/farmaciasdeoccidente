import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import * as moment from 'moment';
import { PrintService } from '../../../../../core/services/internal/print.service';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.scss']
})
export class DispatchesComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;

  dispatches: OrderItem[];
  currentCellar: CellarItem;

  dispatchessp: string[] = [];

  loading = false;
  saving = false;
  searchText: string;

  constructor(
    public store: Store<AppState>,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public router: Router,
    public orderService: OrderService,
    public printService: PrintService
  ) {
  }

  ngOnInit(): void {
    // this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
    //     if (session.permissions !== null) {
    //       const b = session.permissions.filter(pr => pr.name === 'dispatches');
    //       this.dispatchessp = b.length > 0 ? b[0].options : [];
    //       console.log("🚀 ~ file: dispatches.component.ts ~ line 47 ~ DispatchesComponent ~ this.sessionsubscription=this.store.select ~ this.dispatchessp", this.dispatchessp)
    //     }
    // });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadDispatchs();
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  loadDispatchs() {
    this.loading = true;
    this.orderService.getDispatches(this.currentCellar._id).subscribe(data => {
      this.dispatches = data.dispatches;
      this.loading = false;
    });
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'dispatches']);
  }

  updateOrder(order: OrderItem) {
    if (!order.noBill || order.noBill === '') {
      this.toasty.error('El número de factura es necesario');
      return;
    }
    order.state = 'DESPACHO';
    this.loading = true;
    this.orderService.updateOrderState(order).subscribe(data => {
      if (data.ok === true) {
        this.printOrder(data.order);
        this.toasty.success('Orden despachada exitosamente');
        this.loadDispatchs();
      } else {
        this.loading = false;
        this.toasty.error('Error al editar la orden');
      }
    }, error => {
      this.loading = false;
      this.toasty.error('Error al editar la orden');
    });
  }

  printOrder(order: OrderItem) {
    const body = [];

    // ENCABEZADO
    body.push({
      style: 'subheader',
      table: {
        widths: ['*', 250],
        headerRows: 1,
        body: [
          [
            {
              layout: 'noBorders',
              table: {
                widths: ['*'],
                headerRows: 1,
                body: [
                  [{ text: 'Farmacias de Occidente', style: 'header' }],
                  [{ text: 'Dirección...', style: 'text9' }],
                  [{ text: 'Nit: 5525357', style: 'text9' }],
                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                widths: ['*'],
                headerRows: 1,
                body: [
                  [{ text: 'ORDEN DE ENVÍO', style: ['text11', 'boldtext', 'right'] }],
                  [{ text: 'Número de Orden: \n' + order.noOrder, style: ['text8', 'right'] }],
                  [{ text: 'Número de Factura: \n' + order.noBill, style: ['text8', 'right'] }],
                  [{ text: 'Fecha: ' + moment(order.date).format('DD-MMM-YYYY hh:mm:ss'), style: ['text8', 'right'] }],
                ]
              }
            }

          ], [{}, {}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });
    body.push({
      style: 'subheader',
      table: {
        widths: ['*', '*'],
        headerRows: 1,
        body: [
          [
            {
              layout: 'noBorders',
              table: {
                widths: [100, '*'],
                headerRows: 1,
                body: [
                  [{ text: 'NIT:', style: 'text9' }, { text: order.nit, style: 'text9' }],
                  [{ text: 'Nombre del Receptor:', style: 'text9' }, { text: order.name, style: 'text9' }],
                  [{ text: 'Dirección:', style: 'text9' }, { text: order.address + ' ' + order.town + ' ' + order.department, style: 'text9' }],
                ]
              }
            },
            {
              layout: 'noBorders',
              table: {
                widths: [100, 'auto'],
                headerRows: 1,
                body: [
                  // [{ text: 'Fecha de Emisión: ', style:'text9' }, { text: (order._bill.dateE !== null ? moment(order._bill.dateE).format('DD-MMM-YYYY hh:mm:ss') : ''), style:'text9' }],
                  // [{ text: 'Fecha de Certificación: ', style:'text9' }, { text: (order._bill.dateC !== null ? moment(order._bill.dateC).format('DD-MMM-YYYY hh:mm:ss') : ''), style:'text9' }],
                ]
              }
            }

          ], [{}, {}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });



    // DETALLE
    const ArrayToPrint: any[] = [];
    const printColumns: any[] = [
      // { text: 'Cantidad', style: 'cellHeader' },
      { text: 'Descripción', style: 'cellHeader' },
      // { text: 'Precio Unitario con IVA (Q.)', style: 'cellHeader' },
      // { text: 'Descuentos (Q.)', style: 'cellHeader' },
      { text: 'Total (Q.)', style: 'cellHeader' },
      // { text: 'Impuestos', style: 'cellHeader' },
    ];
    ArrayToPrint.push(printColumns);

    const row: any[] = [
      order.details,
    ];
    ArrayToPrint.push(row);


    ArrayToPrint.push([
      {},
      order.total,
    ]);
    body.push({
      style: 'cells',
      table: {
        widths: ['auto', '*', 50, 50, 50, 50],
        headerRows: 1,
        body: ArrayToPrint
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
          ['* Sujeto a pagos trimestrales ISR'],
          ['DATOS DEL CERTIFICADOR: INFILE, SOCIEDAD ANONIMA - NIT 12521337'],
        ]
      }
    });

    this.printService.print(body);
  }

}
