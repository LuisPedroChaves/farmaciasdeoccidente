import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { NewInternalOorderComponent } from '../new-internal-oorder/new-internal-oorder.component';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  expanded = true;

  pendientes: InternalOrderItem[];
  enProceso: InternalOrderItem[];
  enRuta: InternalOrderItem[];
  currentCellar: CellarItem;

  sessionsubscription: Subscription;
  incomingSubscription: Subscription;
  internalOrdersp: string[] = [];

  constructor(
    public store: Store<AppState>,
    public dialog: MatDialog,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'internalOrders');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
  });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadInternalsOrders();

    this.incomingSubscription = this.internalOrderService.getUpdateIncoming().subscribe((internalOrder: InternalOrderItem) => {
      if (internalOrder.type === 'PEDIDO') {
        switch (internalOrder.state) {
          case 'ENVIO':
            this.pendientes.push(internalOrder);
            this.pendientes.sort((a, b) => this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)));
            break;
          case 'CONFIRMACION':
            this.enProceso.push(internalOrder);
            break;
          case 'DESPACHO':
            this.enRuta.push(internalOrder);
            break;

          default:
            this.enRuta = this.enRuta.filter(e => {
              return e._id !== internalOrder._id
            });
            break;
        }
      }
    });
  }

  getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  ngOnDestroy(): void {
    this.incomingSubscription.unsubscribe();
  }

  getExtfile(file: string) {
    if (typeof file === 'string') {
      const nameFile = file.split('.');
      return nameFile[nameFile.length - 1];
    }
  }

  loadInternalsOrders() {
    this.loading = true;
    this.internalOrderService.getIncoming(this.currentCellar._id, 'PEDIDO').subscribe(data => {
      this.pendientes = data.internalOrders.filter(order => order.state === 'ENVIO');
      this.enProceso = data.internalOrders.filter(order => order.state === 'CONFIRMACION');
      this.enRuta = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }

  accept(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Aceptar Pedido', message: '¿Confirma que desea aceptar el pedido  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;
        internalOrder.state = 'CONFIRMACION';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido aceptado exitosamente');
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al aceptar el pedido');
        });
      }
    });
  }

  reject(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Rechazar Pedido', message: '¿Confirma que desea rechazar el pedido  ' + internalOrder.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;
        internalOrder.state = 'RECHAZO';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido rechazado exitosamente');
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al rechazar el pedido');
        });
      }
    });
  }

  dispatch(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Despachar Pedido', message: '¿Confirma que desea despachar el pedido  ' + internalOrder.noOrder + '?', internalOrder },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // if (result !== null) {
        //   internalOrder._delivery = result;
        // }
        this.loading = true;
        internalOrder.state = 'DESPACHO';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido despachado exitosamente');
          this.enProceso = this.enProceso.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al despachar el pedido');
        });
      }
    });
  }

  newInternalOrder() {
    const dialogRef = this.dialog.open(NewInternalOorderComponent, {
      width: this.smallScreen ? '100%' : '600px',
      data: { currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }
}
