import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { combineLatest } from 'rxjs/operators';
import { OrderItem } from 'src/app/core/models/Order';
import { CellarItem } from 'src/app/core/models/Cellar';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { OrderService } from 'src/app/core/services/httpServices/order.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.scss']
})
export class ShipmentsComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;

  orders: OrderItem[];
  currentCellar: CellarItem;

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
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }


  loadOrders() {
    this.loading = true;
    this.orderService.getRoutes(this.currentCellar._id).subscribe(data => {
      this.orders = data.orders;
      this.loading = false;
    });
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'deliveries']);
  }

}
