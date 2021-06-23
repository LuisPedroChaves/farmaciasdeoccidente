import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { InternalOrderService } from '../../../../../core/services/httpServices/internal-order.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { filter } from 'rxjs/operators';
import { NewRequestComponent } from '../new-request/new-request.component';

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

  sessionsubscription: Subscription;
  outgoingSubscription: Subscription;
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
        const b = session.permissions.filter(pr => pr.name === 'internalOrders');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadInternalsOrders();

    this.outgoingSubscription = this.internalOrderService.getUpdateOutgoing().subscribe((internalOrder: InternalOrderItem) => {
      if (internalOrder.type === 'PEDIDO') {
        if (internalOrder.state === 'DESPACHO') {
          this.recibidos.push(internalOrder);
          this.enviados = this.enviados.filter(p => {
            return p._id !== internalOrder._id
          });
        } else if (internalOrder.state !== 'ENTREGA') {
          const index = this.enviados.findIndex(e => e._id === internalOrder._id);
          if (index !== -1) {
            this.enviados[index] = internalOrder;
          } else {
            this.enviados.push(internalOrder);
          }
        }
      }
    });
  }

  loadInternalsOrders() {
    this.loading = true;
    this.internalOrderService.getOutgoing(this.currentCellar._id, 'PEDIDO').subscribe(data => {
      this.enviados = data.internalOrders.filter(order => order.state !== 'DESPACHO');
      this.recibidos = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }

  getExtfile(file: string) {
    const nameFile = file.split('.');
    return nameFile[nameFile.length - 1];
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
        this.loading = true;
        internalOrder.state = 'ENTREGA';
        this.internalOrderService.updateInternalOrderState(internalOrder).subscribe(data => {
          this.toasty.success('Pedido aceptado exitosamente');
          this.recibidos = this.recibidos.filter(p => {
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

  newOrder() {
    const dialogRef = this.dialog.open(NewRequestComponent, {
      width: this.smallScreen ? '100%' : '600px',
      data: { currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     this.loadInternalsOrders();
    //   }
    // });
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
        this.loading = true;
        this.internalOrderService.deleteInternalOrder(internalOrder).subscribe(data => {
          this.toasty.success('Pedido eliminado exitosamente');
          this.enviados = this.enviados.filter(p => {
            return p._id !== data.internalOrder._id
          });
          this.loading = false;
        }, error => {
          this.loading = false;
          this.toasty.error('Error al eliminar el pedido');
        });
      }
    });
  }

}
