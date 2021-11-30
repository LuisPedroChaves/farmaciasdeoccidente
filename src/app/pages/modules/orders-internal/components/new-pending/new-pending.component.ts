import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductAddedItem, ProductItem } from 'src/app/core/models/Product';
import { ProductService } from 'src/app/core/services/httpServices/product.service';

@Component({
  selector: 'app-new-pending',
  templateUrl: './new-pending.component.html',
  styleUrls: ['./new-pending.component.scss']
})
export class NewPendingComponent implements OnInit {

  
  displayedColumns: string[] = ['select', 'quantity', 'name', 'brand', 'unity'];
  dataSource = new MatTableDataSource<ProductAddedItem>([]);
  selection = new SelectionModel<ProductAddedItem>(true, []);

  products: ProductItem[];
  
  constructor(public dialogRef: MatDialogRef<NewPendingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public productsService: ProductService) { }

  ngOnInit(): void {
    this.productsService.loadData(0, 900000).subscribe(data => {
      this.products = data;
      const prods:ProductAddedItem[] = [];
      this.products.forEach(p => {
        prods.push({
          _product: p,
          stock: 0,
          quantity: 0
        });
      });
      this.dataSource = new MatTableDataSource<ProductAddedItem>(prods);
      this.dataSource.filterPredicate = (datas, filtervalue) => {
        return datas._product.description.toString().toLowerCase().includes(filtervalue) || datas._product._brand.name.toLowerCase().includes(filtervalue);
      };
    })
  }



  addProducts() {
    this.selection.selected.map(p => +p.quantity);
    this.dialogRef.close(this.selection.selected);
  }




  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** The label for the checkbox on the passed row */

}
