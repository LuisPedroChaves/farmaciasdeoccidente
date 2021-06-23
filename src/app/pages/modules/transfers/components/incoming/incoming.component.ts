import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { NewTransferComponent } from '../new-transfer/new-transfer.component';

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
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'transfers');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadInternalsOrders();

    this.incomingSubscription = this.internalOrderService.getUpdateIncoming().subscribe((internalOrder: InternalOrderItem) => {
      if (internalOrder.type === 'TRASLADO') {
        switch (internalOrder.state) {
          case 'ENVIO':
            this.pendientes.push(internalOrder);
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

  ngOnDestroy(): void {
    this.incomingSubscription.unsubscribe();
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

  getExtfile(file: string) {
    const nameFile = file.split('.');
    return nameFile[nameFile.length - 1];
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
        this.loading = true;
        internalOrder.state = 'CONFIRMACION';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Traslado aceptado exitosamente');
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
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
        this.loading = true;
        internalOrder.state = 'RECHAZO';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Traslado rechazado exitosamente');
          this.pendientes = this.pendientes.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al rechazar el traslado');
        });
      }
    });
  }

  dispatch(internalOrder: InternalOrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Despachar Traslado', message: '¿Confirma que desea despachar el traslado  ' + internalOrder.noOrder + '?', isDelivery: false },
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
          this.toasty.success('Traslado despachado exitosamente');
          this.enProceso = this.enProceso.filter(p => {
            return p._id !== internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al despachar el traslado');
        });
      }
    });
  }

  newTransfer() {
    const dialogRef = this.dialog.open(NewTransferComponent, {
      width: this.smallScreen ? '100%' : '600px',
      data: { currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }

}
