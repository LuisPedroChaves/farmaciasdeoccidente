import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { OrderItem } from '../../../../../core/models/Order';
import { NewOrderComponent } from '../new-order/new-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { CellarItem } from '../../../../../core/models/Cellar';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;
  sessionsubscription: Subscription;

  orders: OrderItem[];
  currentCellar: CellarItem;

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  });
  ordersp: string[] = [];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['noOrder', 'noBill', 'createdAt', 'nit', 'name', 'phone', 'address', 'sellerCode', 'payment', 'state', 'total', 'options'];
  columnsToDisplay2 = ['image', 'noOrder', 'noBill', 'createdAt', 'nit', 'name', 'phone', 'address', 'sellerCode', 'payment', 'state', 'total', 'options'];
  expandedElement: OrderItem | null;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public orderService: OrderService,
    public toasty: ToastyService,
    public router: Router
  ) {
    this.orderService.readData().subscribe(data => {
      this.orders = data;
      this.dataSource = new MatTableDataSource<OrderItem>(this.orders);
    });

  }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'orders');
        this.ordersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.loadData(range.start, range.end);
        }
      });
  }

  ngAfterContentInit() {
    this.loadData(this.range.get('start').value, this.range.get('end').value);
  }

  ngOnDestroy() {
    this.sessionsubscription?.unsubscribe();
  }

  loadData(start, end) {
    this.orders = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar._id,
      _user: 'all'
    };
    this.orderService.loadData(FILTER);
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'orders']);
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewOrderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { ordersp: this.ordersp, currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadData(this.range.get('start').value, this.range.get('end').value);
      }
    });
  }

  editOrder(order: OrderItem) {
    const dialogRef = this.dialog.open(EditOrderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { order: order, ordersp: this.ordersp },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadData(this.range.get('start').value, this.range.get('end').value);
      }
    });
  }

  delete(order: OrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Orden', message: '¿Confirma que desea eliminar la orden  ' + order.noOrder + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        order.textDeleted = result;
        this.orderService.deleteOrder(order).subscribe(data => {
          this.toasty.success('Orden eliminada exitosamente');
          this.loadData(this.range.get('start').value, this.range.get('end').value);
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la orden');
        });
      }
    });
  }

}
