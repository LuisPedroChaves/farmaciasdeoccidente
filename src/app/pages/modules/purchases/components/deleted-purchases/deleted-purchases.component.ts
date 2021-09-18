import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { DetailsPurchaseComponent } from '../details-purchase/details-purchase.component';
import { PurchaseItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';

@Component({
  selector: 'app-deleted-purchases',
  templateUrl: './deleted-purchases.component.html',
  styleUrls: ['./deleted-purchases.component.scss']
})
export class DeletedPurchasesComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  smallScreen = window.innerWidth < 960 ? true : false;
  currentCellar: CellarItem;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  purchasesSubscription: Subscription;
  purchases: PurchaseItem[];
  purchasesp: string[] = ["read", "update", "delete", "create"];

  dataSource = new MatTableDataSource();
  columns = ['image', 'noBill', '_provider', 'date', 'requisition', 'payment', 'total', '_userDeleted', 'options'];

  constructor(
    public dialog: MatDialog,
    public purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    const FILTER = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
    this.purchasesSubscription = this.purchaseService.getDeletes(FILTER).subscribe(data => {
      this.purchases = data.purchases;
      this.dataSource = new MatTableDataSource<any>(this.purchases);
    });
  }

  ngOnDestroy(): void {
    this.purchasesSubscription?.unsubscribe();
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
      this.purchaseService.getDeletes(filters);
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
      this.purchaseService.getDeletes(filters);
    }
  }

  applyFilter2(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
