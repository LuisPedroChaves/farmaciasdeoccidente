import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { PurchaseItem, PurchaseDetailItem } from '../../../../../core/models/Purchase';

@Component({
  selector: 'app-details-purchase',
  templateUrl: './details-purchase.component.html',
  styleUrls: ['./details-purchase.component.scss']
})
export class DetailsPurchaseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  purchase: PurchaseItem;
  displayedColumns: string[] = ['presentation', 'product', 'requested', 'quantity', 'price', 'bonus', 'discount', 'total', 'cost', 'realQuantity', 'expirationDate'];
  dataSource = new MatTableDataSource();

  constructor(
    public dialogRef: MatDialogRef<DetailsPurchaseComponent>, @Inject(MAT_DIALOG_DATA) public data: PurchaseItem,
  ) { }

  ngOnInit(): void {
    this.purchase = this.data;
    this.dataSource = new MatTableDataSource<PurchaseDetailItem>(this.purchase.detail);
    /* #region  función para poder filtrar subdocumentos dentro de la tabla */
    this.dataSource.filterPredicate = (data: PurchaseDetailItem, filter) => {
      const dataStr = data.presentation.name + data._product.description + data.requested + data.quantity + data.price + data.bonus + data.discount + data.cost + data.realQuantity + data.expirationDate;
      return dataStr.trim().toLowerCase().indexOf(filter) != -1;
    }
    /* #endregion */
    /* #region función para poder ordenar subdocumentos dentro de la tabla */
    this.dataSource.sortingDataAccessor = (item: PurchaseDetailItem, property) => {
      switch (property) {
        case 'presentation': return item.presentation.name;
        case 'product': return item._product.description;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    /* #endregion */
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
