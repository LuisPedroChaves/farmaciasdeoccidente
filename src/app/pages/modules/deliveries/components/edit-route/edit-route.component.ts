import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderItem } from 'src/app/core/models/Order';
import { RouteDetailItem, RouteItem } from 'src/app/core/models/Route';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { RouteService } from 'src/app/core/services/httpServices/route.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  route: RouteItem = {
    _user: this.data.selectedUser,
    _cellar: null,
    noRoute: 0,
    details: [],
    state: 'INICIO'
  };

  orders: OrderItem[] = [];
  currentCellar: CellarItem;
  searchText: string;

  constructor(
    public dialogRef: MatDialogRef<EditRouteComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public orderService: OrderService,
    public routeService: RouteService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadOrders();
    this.route = this.data.route;
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getRoutes(this.currentCellar._id).subscribe(data => {
      this.orders = data.orders;
      this.orders = this.orders.filter(user => user._delivery === null);
      this.loading = false;
    });
  }

  getMinutes(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.round((((date2.getTime() - date1.getTime()) % 86400000) % 3600000) / 60000).toFixed(2);
  }

  getHours(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.floor(((date2.getTime() - date1.getTime()) % 86400000) / 3600000).toFixed(2);
  }

  getDays(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return Math.floor((date2.getTime() - date1.getTime()) / 86400000).toFixed(2);
  }

  addOrder(order: OrderItem) {
    if (this.route.details.find(detail => detail._order._id === order._id) || this.route.state !== 'INICIO')  {
      return;
    }
    let detail: RouteDetailItem = {
      _order: order
    };
    this.route.details.push(detail);
    const indexOrder = this.orders.findIndex(item => item._id === order._id);
    this.orders.splice(indexOrder, 1);
  }

  removeOrder(order: OrderItem) {
    this.orders.push(order);
    const indexOrder = this.route.details.findIndex(item => (item._order && item._order._id === order._id));
    this.route.details.splice(indexOrder, 1);
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Ruta', message: '¿Confirma que desea eliminar la ruta ' + this.route.noRoute + '?'},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.routeService.deleteRoute(this.route).subscribe(data => {
            this.toasty.success('Ruta eliminada exitosamente');
            this.dialogRef.close('ok');
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toasty.error('Error al eliminar el ruta');
          });
        }
      }
    });
  }

  saveRoute() {
    this.loading = true;
    this.routeService.updateRouter(this.route).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Ruta editada exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al editar la ruta');
      }
    }, error => {
      this.loading = false;
      this.toasty.error('Error al editar la ruta');
    });
  }

  finishRoute() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Finalizar Ruta', message: '¿Confirma que desea finalizar la ruta ' + this.route.noRoute + '?'},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.route.state = 'FIN';
          this.routeService.updateRouterState(this.route).subscribe(data => {
            this.toasty.success('Ruta finalizada exitosamente');
            this.dialogRef.close('ok');
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toasty.error('Error al finalizar la ruta');
          });
        }
      }
    });
  }

  getTotal() {
    return this.route.details.reduce((sum, item) => sum + item._order.total, 0).toFixed(2);
  }

}
