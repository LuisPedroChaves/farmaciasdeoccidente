import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderItem } from 'src/app/core/models/Order';
import { RouteItem, RouteDetailItem } from '../../../../../core/models/Route';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { RouteService } from '../../../../../core/services/httpServices/route.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

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
  currentCellar: CellarItem;
  searchText: string;

  constructor(
    public dialogRef: MatDialogRef<NewRouteComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public routeService: RouteService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getRoutes(this.currentCellar._id).subscribe(data => {
      this.orders = data.orders;
      this.orders = this.orders.filter(user => user._delivery === null);
      this.loading = false;
    });
  }

  addOrder(order: OrderItem) {
    if (this.newRoute.details.find(detail => detail._order._id === order._id)) {
      return;
    }
    let detail: RouteDetailItem = {
      _order: order
    };
    this.newRoute.details.push(detail);
    const indexOrder = this.orders.findIndex(item => item._id === order._id);
    this.orders.splice(indexOrder, 1);
  }

  removeOrder(order: OrderItem) {
    this.orders.push(order);
    const indexOrder = this.newRoute.details.findIndex(item => item._order._id === order._id);
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
