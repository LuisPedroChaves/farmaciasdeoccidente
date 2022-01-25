import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderItem } from 'src/app/core/models/Order';
import { AppState } from 'src/app/core/store/app.reducer';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { DetailsQuotesComponent } from '../../../../shared/components/details-quotes/details-quotes.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterContentInit, OnDestroy {
  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  quotesSubscription: Subscription;

  orders: OrderItem[];
  currentCellar: CellarItem;

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  quotesp: string[] = [];
  loading = false;

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'noOrder',
    'noBill',
    'createdAt',
    'nit',
    'name',
    'phone',
    'address',
    'sellerCode',
    'payment',
    'total',
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
    'address',
    'sellerCode',
    'payment',
    'total',
    'options',
  ];

  constructor(
    private orderService: OrderService,
    public store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    private toasty: ToastyService
  ) {}

  ngOnInit(): void {
    this.sessionsubscription = this.store
      .select('session')
      .pipe(filter((session) => session !== null))
      .subscribe((session) => {
        if (session.permissions !== null) {
          const b = session.permissions.filter((pr) => pr.name === 'quotes');
          this.quotesp = b.length > 0 ? b[0].options : [];
        }
      });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.range.valueChanges.pipe(debounceTime(500)).subscribe((range) => {
      if (range.start && range.end) {
        this.loadData(range.start, range.end);
      }
    });
  }

  ngAfterContentInit(): void {
    this.loadData(this.range.get('start').value, this.range.get('end').value);
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  loadData(start, end): void {
    this.orders = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar._id,
    };
    this.orderService.getQuotes(FILTER).subscribe((resp) => {
      this.orders = resp.orders;
      console.log(this.orders);
      this.dataSource = new MatTableDataSource<OrderItem>(this.orders);
    });
  }

  details(purchase: OrderItem): void {
    const dialogRef = this.dialog.open(DetailsQuotesComponent, {
      width: this.smallScreen ? '100%' : '1280px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { ...purchase },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }

  // selectOrder(order: OrderItem): void {
  //   this.router.navigate(['/order', order._id, 'orders']);
  // }

  applyFilter2(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateOrder(order: OrderItem): void {
    order.state = 'ORDEN';
    this.loading = true;
    this.orderService.updateOrderState(order).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Cotización procesada exitosamente');
          this.loadData(
            this.range.get('start').value,
            this.range.get('end').value
          );
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al editar la cotización');
        }
      },
      (error) => {
        this.loading = false;
        this.toasty.error('Error al editar la cotización');
      }
    );
  }

  // TODO: Agregar boton para anular cotizacion
  // delete(order: OrderItem) {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '350px',
  //     data: { title: 'Eliminar Orden', message: '¿Confirma que desea eliminar la orden  ' + order.noOrder + '?', description: true },
  //     disableClose: true,
  //     panelClass: ['farmacia-dialog', 'farmacia'],
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result !== undefined) {
  //       // this.loading = true;
  //       order.textDeleted = result;
  //       this.orderService.deleteOrder(order).subscribe(data => {
  //         this.toasty.success('Orden eliminada exitosamente');
  //         this.loadData(this.range.get('start').value, this.range.get('end').value);
  //         // this.loading = false;
  //       }, error => {
  //         // this.loading = false;
  //         this.toasty.error('Error al eliminar la orden');
  //       });
  //     }
  //   });
  // }
}
