import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDetailItem, OrderItem } from 'src/app/core/models/Order';

@Component({
  selector: 'app-details-quotes',
  templateUrl: './details-quotes.component.html',
  styleUrls: ['./details-quotes.component.scss']
})
export class DetailsQuotesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  quote: OrderItem;
  displayedColumns: string[] = [
    'presentation',
    'product',
    'quantity',
    'price',
    'subtotal',
  ];
  dataSource = new MatTableDataSource();

  constructor(
    public dialogRef: MatDialogRef<DetailsQuotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderItem
  ) {}

  ngOnInit(): void {
    this.quote = this.data;
    console.log(this.quote);
    this.dataSource = new MatTableDataSource<OrderDetailItem>(this.quote.detail);
    /* #region  función para poder filtrar subdocumentos dentro de la tabla */
    this.dataSource.filterPredicate = (data: OrderDetailItem, filter) => {
      // tslint:disable-next-line: max-line-length
      const dataStr = data.presentation.name + data._product.description + data.quantity + data.price;
      return dataStr.trim().toLowerCase().indexOf(filter) !== -1;
    };
    /* #endregion */
    /* #region función para poder ordenar subdocumentos dentro de la tabla */
    this.dataSource.sortingDataAccessor = (item: OrderDetailItem, property) => {
      switch (property) {
        case 'presentation': return item.presentation.name;
        case 'product': return item._product.description;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    /* #endregion */
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
