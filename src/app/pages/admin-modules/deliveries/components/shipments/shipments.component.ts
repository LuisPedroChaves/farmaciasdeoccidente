import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';
import { AppState } from 'src/app/core/store/app.reducer';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { OrderItem } from 'src/app/core/models/Order';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;

  orders: OrderItem[];
  internalOrders: InternalOrderItem[];

  dispatchessp: string[] = [];

  loading = false;
  saving = false;
  searchText: string;

  avatars = [
    { index: 0, image: '/assets/images/avatars/01.png' },
    { index: 1, image: '/assets/images/avatars/02.png' },
    { index: 2, image: '/assets/images/avatars/03.png' },
    { index: 3, image: '/assets/images/avatars/04.png' },
    { index: 4, image: '/assets/images/avatars/05.png' },
    { index: 5, image: '/assets/images/avatars/00M.jpg' },
    { index: 6, image: '/assets/images/avatars/00F.jpg' },
  ];

  constructor(
    public store: Store<AppState>,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public router: Router,
    public orderService: OrderService,
    public internalOrdersService: InternalOrderService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  load() {
    this.loading = true;
    combineLatest([
      this.orderService.getAdminRoutes(),
      this.internalOrdersService.getActives()
    ]).subscribe(data => {
      this.orders = data[0].orders;
      this.internalOrders = data[1].internalOrders;
      this.loading = false;
    });
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['admin/order', order._id, 'admin/deliveries']);
  }

}
