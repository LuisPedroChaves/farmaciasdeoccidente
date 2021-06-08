import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { RouteService } from 'src/app/core/services/httpServices/route.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { RouteDetailItem, RouteItem } from 'src/app/core/models/Route';
import { OrderItem } from 'src/app/core/models/Order';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { combineLatest } from 'rxjs';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';

@Component({
  selector: 'app-new-route',
  templateUrl: './new-route.component.html',
  styleUrls: ['./new-route.component.scss']
})
export class NewRouteComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  newRoute: RouteItem = {
    _user: this.data.selectedUser,
    noRoute: 0,
    details: [],
    state: 'INICIO'
  };

  orders: OrderItem[] = [];
  internalOrders: InternalOrderItem[] = [];
  searchText: string;

  constructor(
    public dialogRef: MatDialogRef<NewRouteComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public routeService: RouteService,
    public toasty: ToastyService,
    public internalOrdersService: InternalOrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    combineLatest([
      this.orderService.getAdminRoutes(),
      this.internalOrdersService.getActives()
    ]).subscribe(data => {
      this.orders = data[0].orders;
      this.orders = this.orders.filter(user => user._delivery === null);
      this.internalOrders = data[1].internalOrders;
      this.internalOrders = this.internalOrders.filter(internalOrder => internalOrder._delivery === null);
      this.loading = false;
    });
  }

  addOrder(order: OrderItem) {
    let detail: RouteDetailItem = {
      _order: order,
    };
    this.newRoute.details.push(detail);
    const indexOrder = this.orders.findIndex(item => item._id === order._id);
    this.orders.splice(indexOrder, 1);
  }

  addInternalOrder(internalOrder: InternalOrderItem) {
    let detail: RouteDetailItem = {
      _internalOrder: internalOrder
    };
    this.newRoute.details.push(detail);
    const indexOrder = this.internalOrders.findIndex(item => item._id === internalOrder._id);
    this.internalOrders.splice(indexOrder, 1);
  }

  removeOrder(order: OrderItem) {
    this.orders.push(order);
    const indexOrder = this.newRoute.details.findIndex(item => (item._order && item._order._id === order._id));
    this.newRoute.details.splice(indexOrder, 1);
  }

  removeInternalOrder(internalOrder: InternalOrderItem) {
    this.internalOrders.push(internalOrder);
    const indexOrder = this.newRoute.details.findIndex(item => (item._internalOrder && item._internalOrder._id === internalOrder._id));
    this.newRoute.details.splice(indexOrder, 1);
  }

  saveRoute() {
    this.loading = true;
    this.routeService.createRoute(this.newRoute).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Ruta creada exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear ruta');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear ruta');
    });
  }

}
