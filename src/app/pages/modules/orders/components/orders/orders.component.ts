import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { OrderItem } from '../../../../../core/models/Order';
import { filter } from 'rxjs/operators';
import { NewOrderComponent } from '../new-order/new-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { CellarItem } from '../../../../../core/models/Cellar';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { Router } from '@angular/router';
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

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

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

  }

  ngAfterContentInit() {
    const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
    this.orderService.loadData(filter);
  }

  ngOnDestroy() {
    this.sessionsubscription?.unsubscribe();
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'orders']);
  }

  applyFilter(filterValue?: string) {
    if (filterValue) {

      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
      this.orderService.loadData(filters);
    } else {
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
      this.orderService.loadData(filters);
    }
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
        const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
        this.orderService.loadData(filter);
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
        const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
        this.orderService.loadData(filter);
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
          const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
          this.orderService.loadData(filter);
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la orden');
        });
      }
    });
  }

}
