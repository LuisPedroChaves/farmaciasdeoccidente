import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem, InternalOrderItemFull } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;
  expanded = true;
  loading = false;
  currentCellar: CellarItem;
  sidePanelOpened: boolean = false;
  collapse: boolean = false;

  pendientes: InternalOrderItem[] = [];
  enProceso: InternalOrderItem[] = [];
  enRuta: InternalOrderItem[] = [];

  sessionsubscription: Subscription;
  incomingSubscription: Subscription;
  internalOrdersp: string[] = [];
  currentOrder: InternalOrderItemFull;
  constructor(public store: Store<AppState>,
    public dialog: MatDialog,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService) { }

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
          case 'ENVIO': this.pendientes.push(internalOrder); this.pendientes.sort((a, b) => this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)));  break;
          case 'CONFIRMACION': this.enProceso.push(internalOrder); break;
          case 'DESPACHO': this.enRuta.push(internalOrder);  break;

          default:
            this.enRuta = this.enRuta.filter(e => {return e._id !== internalOrder._id     });
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

  loadInternalsOrders() {
    this.loading = true;
    this.internalOrderService.getIncoming(this.currentCellar._id, 'PEDIDO').subscribe(data => {
      this.pendientes = data.internalOrders.filter(order => order.state === 'ENVIO').sort((a, b) => this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)));
      this.enProceso = data.internalOrders.filter(order => order.state === 'CONFIRMACION');
      this.enRuta = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }


  details(order: InternalOrderItem, icon: string, color: string) {
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      width: this.smallScreen ? '100%' : '600px',
      data: { order: order,internalOrdersp: this.internalOrdersp, icon: icon, color: color, module: 'SHIPS' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'ACCEPT') {
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== order._id
          });
          this.loading = false;
        }
        if (result === 'REJECT') {
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== order._id
          });
          this.loading = false;
        }
        if (result === 'DISPATCH') {
          this.enProceso = this.enProceso.filter(p => {
            return p._id !== order._id
          });
          this.loading = false;
        }
        this.loadInternalsOrders();
      }
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
    this.currentOrder = {...internalOrder, detail: []};
    this.collapse = true;
  }

  dispatched() {
    this.enProceso = this.enProceso.filter(p => {
      return p._id !== this.currentOrder._id
    });
    this.currentOrder = undefined;
    this.collapse = false;
    this.loading = false;
  }

}
