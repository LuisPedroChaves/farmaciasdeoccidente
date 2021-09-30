import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CellarItem } from 'src/app/core/models/Cellar';
import { DetailsPurchaseComponent } from '../details-purchase/details-purchase.component';
import { PurchaseItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-history-purchases',
  templateUrl: './history-purchases.component.html',
  styleUrls: ['./history-purchases.component.scss']
})
export class HistoryPurchasesComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;
  currentCellar: CellarItem;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  purchases: PurchaseItem[];
  purchaseSubscription: Subscription;
  purchasesp: string[] = ["read", "update", "delete", "create"];

  dataSource = new MatTableDataSource();
  columns = ['image', 'noBill', '_provider', 'date', 'requisition', 'payment', 'total', '_user', 'options'];

  constructor(
    public dialog: MatDialog,
    public purchaseService: PurchaseService,
    public toasty: ToastyService
  ) {
    this.purchaseSubscription = this.purchaseService.readData().subscribe(data => {
      this.purchases = data;
      this.dataSource = new MatTableDataSource<PurchaseItem>(this.purchases);
    });
  }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.purchaseSubscription?.unsubscribe();
  }

  loadData(start, end) {
    this.purchases = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = { startDate, endDate, _cellar: this.currentCellar._id };
    this.purchaseService.loadData(FILTER);
  }

  details(purchase: PurchaseItem) {
    const dialogRef = this.dialog.open(DetailsPurchaseComponent, {
      width: this.smallScreen ? '100%' : '1280px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { ...purchase },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }

  applyFilter2(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(purchase: PurchaseItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Anular Factura', message: '¿Confirma que desea anular la factura No.  ' + purchase.noBill + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        purchase.textDeleted = result;
        this.purchaseService.deletePurchase(purchase).subscribe(data => {
          this.toasty.success('Factura eliminada exitosamente');
          this.loadData(this.range.get('start').value, this.range.get('end').value);
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la factura');
        });
      }
    });
  }

}
