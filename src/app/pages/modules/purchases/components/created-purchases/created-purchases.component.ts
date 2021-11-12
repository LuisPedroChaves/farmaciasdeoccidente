import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { DetailsPurchaseComponent } from '../details-purchase/details-purchase.component';
import { PurchaseItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-created-purchases',
  templateUrl: './created-purchases.component.html',
  styleUrls: ['./created-purchases.component.scss']
})
export class CreatedPurchasesComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() sendTotal: EventEmitter<number> = new EventEmitter();
  smallScreen = window.innerWidth < 960 ? true : false;
  currentCellar: CellarItem;

  purchasesSubscription: Subscription;
  purchases: PurchaseItem[];
  purchasesp: string[] = ["read", "update", "delete", "create"];

  dataSource = new MatTableDataSource();
  columns = ['image', 'requisition',  'noBill', 'date', '_provider', 'payment', 'total', '_lastUpdate', 'options'];

  constructor(
    public dialog: MatDialog,
    public purchaseService: PurchaseService,
    private toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadPurchases();
  }

  ngOnDestroy(): void {
    this.purchasesSubscription?.unsubscribe();
  }

  loadPurchases() {
    this.purchasesSubscription = this.purchaseService.getCreated(this.currentCellar._id).subscribe(data => {
      this.purchases = data.purchases;
      this.sendTotal.emit(this.purchases.length);
      this.dataSource = new MatTableDataSource<any>(this.purchases);
    });
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
          this.loadPurchases();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la factura');
        });
      }
    });
  }

}
