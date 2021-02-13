import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { NewSaleComponent } from '../new-sale/new-sale.component';
import { EditSaleComponent } from '../edit-sale/edit-sale.component';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { SaleItem } from '../../../../../core/models/Sale';
import { SaleService } from '../../../../../core/services/httpServices/sale.service';
import { PaySaleComponent } from '../pay-sale/pay-sale.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;

  sales: SaleItem[];
  currentCellar: CellarItem;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  salesp: string[] = [];

  dataSource = new MatTableDataSource();
  columnsToDisplay = [ 'noBill', 'date', 'code', 'nit', 'name', 'phone', 'paid', 'total', 'options'];
  columnsToDisplay2 = ['image',  'noBill', 'date', 'code', 'nit', 'name', 'phone', 'paid', 'total', 'options'];
  expandedElement: SaleItem | null;

  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public saleService: SaleService,
    public toasty: ToastyService,
    public router: Router
  ) {
    this.saleService.readData().subscribe(data => {
      this.sales = data;
      this.dataSource = new MatTableDataSource<SaleItem>(this.sales);
    });
  }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'sales');
        this.salesp = b.length > 0 ? b[0].options : [];
      }
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  ngAfterContentInit() {
    const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
    this.saleService.loadData(filter);
  }

  ngOnDestroy() {
    this.sessionsubscription?.unsubscribe();
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
      this.saleService.loadData(filters);
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
      this.saleService.loadData(filters);
    }
  }


  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewSaleComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '85vh',
      maxHeight: '78vh',
      data: { salesp: this.salesp, currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
        this.saleService.loadData(filter);
      }
    });
  }

  editOrder(sale: SaleItem) {
    // const dialogRef = this.dialog.open(EditSaleComponent, {
    //   width: this.smallScreen ? '100%' : '800px',
    //   data: { order: order, ordersp: this.salesp },
    //   disableClose: true,
    //   panelClass: ['farmacia-dialog', 'farmacia'],
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
    //     this.saleService.loadData(filter);
    //   }
    // });
  }

  delete(sale: SaleItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Venta', message: '¿Confirma que desea eliminar la venta  ' + sale.noBill + '?', isLogin: true},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          // this.loading = true;
          this.saleService.deleteSale(sale).subscribe(data => {
            this.toasty.success('Venta eliminada exitosamente');
            const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
            this.saleService.loadData(filter);
            // this.loading = false;
          }, error => {
            // this.loading = false;
            this.toasty.error('Error al eliminar la venta');
          });
        }
      }
    });
  }

}
