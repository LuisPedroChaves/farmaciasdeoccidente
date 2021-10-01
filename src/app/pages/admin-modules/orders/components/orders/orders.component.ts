import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { UserService } from 'src/app/core/services/httpServices/user.service';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { OrderItem } from 'src/app/core/models/Order';
import { CellarItem } from 'src/app/core/models/Cellar';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { UserItem } from 'src/app/core/models/User';
import { NewOrderComponent } from '../new-order/new-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;
  ordersSubscription: Subscription;
  cellarsSubscription: Subscription;
  usersSubscription: Subscription;

  orders: OrderItem[];
  cellars: CellarItem[];
  users: UserItem[];

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  });
  currentCellar = 'all';
  currentUser = 'all';

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'noOrder',
    'noBill',
    'createdAt',
    'nit',
    'name',
    'phone',
    'payment',
    'state',
    'total',
    'sellerCode',
    '_user',
    '_cellar',
    'options',
  ];
  columnsToDisplay2 = [
    'image',
    'noOrder',
    'noBill',
    'createdAt',
    'nit',
    'name',
    'phone',
    'payment',
    'state',
    'total',
    'sellerCode',
    '_user',
    '_cellar',
    'options',
  ];
  expandedElement: OrderItem | null;

  constructor(
    public router: Router,
    public orderService: OrderService,
    public cellarService: CellarService,
    public userService: UserService,
    public dialog: MatDialog,
    public toasty: ToastyService,
    public printService: PrintService,
    public timeFormat: TimeFormatPipe,
    public datepipe: DatePipe
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data) => {
        this.cellars = data;
      });
    this.ordersSubscription = this.orderService.readData().subscribe((data) => {
      this.orders = data;
      this.dataSource = new MatTableDataSource<OrderItem>(this.orders);
    });
    this.usersSubscription = this.userService.readData().subscribe((data) => {
      this.users = data;
      this.users = this.users.filter((user) => user._role.type === 'DELIVERY');
    });
  }

  ngOnInit(): void {
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
    this.cellarService.loadData();
    this.userService.loadData();
  }

  ngOnDestroy(): void {
    this.ordersSubscription.unsubscribe();
    this.cellarsSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  loadData(start, end) {
    this.orders = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar,
      _user: this.currentUser,
    };
    this.orderService.loadData(FILTER);
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['admin/order', order._id, 'admin/adminOrders']);
  }

  getLength(): number {
    return this.orders.filter((order) => order.state === 'ENTREGA').length;
  }

  getTotal() {
    return this.orders
      .filter((order) => order.state === 'ENTREGA')
      .reduce((sum, item) => sum + item.total, 0)
      .toFixed(2);
  }

  groupBy(key) {
    const OBJECT = this.orders
      .filter((order) => order.state === 'ENTREGA')
      .reduce((acc, obj) => {
        const property = obj[key];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
      }, {});
    return Object.keys(OBJECT).length;
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewOrderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loadData(this.range.get('start').value, this.range.get('end').value);
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loadData(this.range.get('start').value, this.range.get('end').value);
      }
    });
  }

  delete(order: OrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Orden',
        message:
          '¿Confirma que desea eliminar la orden  ' + order.noOrder + '?',
        description: true,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.loading = true;
        order.textDeleted = result;
        this.orderService.deleteOrder(order).subscribe(
          (data) => {
            this.toasty.success('Orden eliminada exitosamente');
          this.loadData(this.range.get('start').value, this.range.get('end').value);
            // this.loading = false;
          },
          (error) => {
            // this.loading = false;
            this.toasty.error('Error al eliminar la orden');
          }
        );
      }
    });
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  printReport() {
    const body = [];
    body.push({ text: 'FARMACIAS DE OCCIDENTE S.A', style: ['header'] });
    body.push({ text: 'Reporte de ventas', style: ['subheader'] });
    const CELLAR = this.cellars.find((c) => c._id === this.currentCellar);
    if (CELLAR) {
      body.push({ text: `Sucursal: ${CELLAR.name}`, style: ['subheader'] });
    } else {
      body.push({ text: `Sucursal: Todas`, style: ['subheader'] });
    }
    body.push({
      text: `Correspondientes a: ${this.datepipe.transform(this.range.get('start').value, 'dd/MM/yyyy')} - ${this.datepipe.transform(this.range.get('end').value, 'dd/MM/yyyy')} `,
      style: ['muted', 'subheader'],
    });
    body.push({ text: '\n' });

    const ArrayToPrint: any[] = [];
    const ArrayToPrint2: any[] = [];
    const printColumns: any[] = [
      { text: 'Ventas', style: 'cellHeader' },
      { text: 'Domicilios', style: 'cellHeader' },
      { text: 'Recaudado', style: 'cellHeader' },
    ];
    const printColumns2: any[] = [
      { text: 'No. Orden', style: 'cellHeader' },
      { text: 'No. Factura', style: 'cellHeader' },
      { text: 'Fecha', style: 'cellHeader' },
      { text: 'Nit', style: 'cellHeader' },
      { text: 'Nombre', style: 'cellHeader' },
      { text: 'Teléfono', style: 'cellHeader' },
      { text: 'Método de pago', style: 'cellHeader' },
      { text: 'Estado', style: 'cellHeader' },
      { text: 'Total', style: 'cellHeader' },
      { text: 'Vendedor', style: 'cellHeader' },
      { text: 'Usuario', style: 'cellHeader' },
      { text: 'Sucursal', style: 'cellHeader' },
    ];
    ArrayToPrint.push(printColumns);
    ArrayToPrint.push([
      this.getLength(),
      this.groupBy('name'),
      'Q ' + this.getTotal(),
    ]);
    ArrayToPrint2.push(printColumns2);

    const rowArray: any[] = [];
    this.orders.forEach((o) => {
      if (o.noBill === undefined) {
        o.noBill = '-';
      }
      if (o.sellerCode === undefined) {
        o.sellerCode = '-';
      }
      const FORMAT_DATE = this.timeFormat.transform(
        o.date,
        'DD/MM/YYYY hh:mm',
        'es'
      );
      const ROW: string[] = [
        o.noOrder,
        o.noBill,
        FORMAT_DATE,
        o.nit,
        o.name,
        o.phone,
        o.payment,
        o.state,
        `Q ${o.total.toFixed(2)}`,
        o.sellerCode,
        o._user.name,
        o._cellar.name,
      ];
      rowArray.push(ROW);
    });

    rowArray.forEach((row) => {
      ArrayToPrint2.push(row);
    });

    body.push({
      style: 'cellMetrics',
      table: {
        widths: [
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
        ],
        headerRows: 1,
        body: ArrayToPrint,
      },
    });
    body.push({ text: '\n' });
    body.push({
      style: 'cells',
      table: {
        widths: [
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
          '*',
        ],
        headerRows: 1,
        body: ArrayToPrint2,
      },
    });

    this.printService.printLandscape(body);
  }
}
