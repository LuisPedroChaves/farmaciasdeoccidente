import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import * as moment from 'moment';
import { PrintService } from '../../../../../core/services/internal/print.service';
import { filter } from 'rxjs/operators';
import { DetailsQuotesComponent } from '../../../../shared/components/details-quotes/details-quotes.component';

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

  dispatchesp: string[] = [];

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
    this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
        if (session.permissions !== null) {
          const b = session.permissions.filter(pr => pr.name === 'dispatches');
          this.dispatchesp = b.length > 0 ? b[0].options : [];
        }
    });
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
      console.log(this.dispatches);
      this.loading = false;
    });
  }
  details(purchase: OrderItem): void {
    const dialogRef = this.dialog.open(DetailsQuotesComponent, {
      width: this.smallScreen ? '100%' : '1280px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { ...purchase },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
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
                  [{ text: 'Farmacias de Occidente', style: 'header' }],
                  [{ text: 'Dirección: ' + this.currentCellar.address, style: 'text9' }],
                  [{ text: 'Nit: 8838044-0', style: 'text9' }],
                ]
              }
            }
          ], [{}]
        ]
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
                  [{ text: 'ORDEN DE ENVÍO', style: ['text11', 'boldtext'] }],
                  [{ text: 'No.' + order.noOrder, style: ['text10'] }],
                  [{ text: 'Factura: \n' + order.noBill, style: ['text8'] }],
                  [{ text: 'Fecha: ' + moment(order.date).format('DD-MMM-YYYY hh:mm:ss'), style: ['text8'] }],
                ]
              }
            }
          ], [{}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });
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
                widths: [50, '*'],
                headerRows: 1,
                body: [
                  [{ text: 'NIT:', style: 'text9' }, { text: order.nit, style: 'text9' }],
                  [{ text: 'Nombre:', style: 'text9' }, { text: order.name, style: 'text9' }],
                  [{ text: 'Dirección:', style: 'text9' }, { text: order.address + ' ' + order.town + ' ' + order.department, style: 'text9' }],
                  [{ text: 'Método de pago: ', style:'text9' }, { text: order.payment, style:'text9' }],
                  [{ text: 'Teléfono: ', style:'text9' }, { text: order.phone, style:'text9' }],
                  [{ text: 'Total (Q): ', style:'text9' }, { text: order.total, style:'text9' }],
                ]
              }
            }
          ], [{}]
        ]
      },
      layout: 'headerLineOnly'
    });
    body.push({ text: '\n' });
    body.push({
      style: 'cells',
      layout: 'noBorders',
      table: {
        widths: ['*'],
        headerRows: 1,
        body: [
          ['GRACIAS POR SU PREFERENCIA'],
          // ['DATOS DEL CERTIFICADOR: INFILE, SOCIEDAD ANONIMA - NIT 12521337'],
        ]
      }
    });

    this.printService.print(body);
  }

}
