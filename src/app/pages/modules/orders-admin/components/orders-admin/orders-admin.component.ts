import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderItem } from 'src/app/core/models/Order';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { NewOrderComponent } from '../../../orders-admin/components/new-order/new-order.component';
import { EditOrderComponent } from '../../../orders-admin/components/edit-order/edit-order.component';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.scss']
})
export class OrdersAdminComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  orders: OrderItem[];

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['noOrder', 'noBill', 'createdAt', 'nit', 'name', 'phone', 'payment', 'state', 'total', '_user', '_cellar', 'options'];
  columnsToDisplay2 = ['image', 'noOrder', 'noBill', 'createdAt', 'nit', 'name', 'phone', 'payment', 'state', 'total', '_user', '_cellar', 'options'];
  expandedElement: OrderItem | null;

  constructor(
    public router: Router,
    public orderService: OrderService,
    public dialog: MatDialog,
    public toasty: ToastyService,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const filter = { month: this.month, year: this.year };
    this.orderService.getOrders(filter).subscribe(data => {
      this.orders = data.orders;
      this.dataSource = new MatTableDataSource<OrderItem>(this.orders);
      this.loading = false;
    });
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['admin/order', order._id, 'admin/orders']);
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewOrderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const filter = { month: this.month, year: this.year };
        this.loadOrders();
      }
    });
  }

  editOrder(order: OrderItem) {
    const dialogRef = this.dialog.open(EditOrderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { order: order },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadOrders();
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
          this.loadOrders();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la orden');
        });
      }
    });
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
      this.loadOrders();
    } else {
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      this.loadOrders();
    }
  }


  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
