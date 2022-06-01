import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { CellarItem } from 'src/app/core/models/Cellar';
import { SaleItem } from 'src/app/core/models/Sale';
import { SaleService } from 'src/app/core/services/httpServices/sale.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { PaySaleComponent } from '../pay-sale/pay-sale.component';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit, OnDestroy{

  @ViewChild('drawer') drawer: MatDrawer;
  loading = false;

  currentCellar: CellarItem;
  saleSubscription: Subscription;
  sales: SaleItem[];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource([]);
  columns = [
    'noBill', 'date', 'code', 'nit', 'name', 'phone', 'paid', 'total', 'options'
  ];

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private saleService: SaleService,
    public store: Store<AppState>,
    private dialog: MatDialog,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    //Historial
    this.saleSubscription = this.saleService.readData().subscribe(data => {
      this.sales = data;
      this.dataSource = new MatTableDataSource<SaleItem>(this.sales);
      this.loading = false;
    });

    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.history(range.start._d, range.end._d);
        }
      });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'sales');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngOnDestroy(): void {
    this.saleSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  history(startDate, endDate) {
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar._id
    }
    this.saleService.loadData(FILTER);
  }

  pay(sale: SaleItem) {
    const dialogRef = this.dialog.open(PaySaleComponent, {
      width: '500px',
      minHeight: '85vh',
      maxHeight: '78vh',
      disableClose: true,
      data: { sale },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      }
    });
  }

  delete(sale: SaleItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Venta', message: '¿Confirma que desea eliminar la venta  ' + sale.noBill + '?', isLogin: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          // this.loading = true;
          this.saleService.deleteSale(sale).subscribe(data => {
            this.toastyService.success('Venta eliminada exitosamente');
            this.history(this.range.get('start').value, this.range.get('end').value);
            // this.loading = false;
          }, error => {
            // this.loading = false;
            this.toastyService.error('Error al eliminar la venta');
          });
        }
      }
    });
  }

}
