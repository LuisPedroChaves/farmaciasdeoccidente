import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { PurchaseItem } from 'src/app/core/models/Purchase';
import { PurchaseService } from 'src/app/core/services/httpServices/purchase.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { DetailsPurchaseComponent } from '../details-purchase/details-purchase.component';

@Component({
  selector: 'app-requisition-purchases',
  templateUrl: './requisition-purchases.component.html',
  styleUrls: ['./requisition-purchases.component.scss']
})
export class RequisitionPurchasesComponent implements OnInit, OnDestroy {

  @Output() sendTotal: EventEmitter<number> = new EventEmitter();
  smallScreen = window.innerWidth < 960 ? true : false;
  currentCellar: CellarItem;
  searchText: string;

  purchasesSubscription: Subscription;
  soketSubscription: Subscription;
  purchases: PurchaseItem[];
  purchasesp: string[] = ["read", "update", "delete", "create"];

  constructor(
    public dialog: MatDialog,
    public purchaseService: PurchaseService,
    private toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadPurchases();
    this.soketSubscription = this.purchaseService.getRequisitionSocket().subscribe((purchase: PurchaseItem) => {
      if (this.purchases) {
        this.purchases.push(purchase);
        this.sendTotal.emit(this.purchases.length);
      }
    });
  }

  ngOnDestroy(): void {
    this.purchasesSubscription?.unsubscribe();
    this.soketSubscription?.unsubscribe();
  }

  loadPurchases() {
    this.purchasesSubscription = this.purchaseService.getRequisitions(this.currentCellar._id).subscribe(data => {
      this.purchases = data.purchases;
      this.sendTotal.emit(this.purchases.length);
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

  delete(purchase: PurchaseItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Anular Requisición', message: '¿Confirma que desea anular la requisición No.  ' + purchase.requisition + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // this.loading = true;
        purchase.textDeleted = result;
        this.purchaseService.deletePurchase(purchase).subscribe(data => {
          this.toasty.success('Requisición eliminada exitosamente');
          this.loadPurchases();
          // this.loading = false;
        }, error => {
          // this.loading = false;
          this.toasty.error('Error al eliminar la requisición');
        });
      }
    });
  }

}
