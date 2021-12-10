import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

import { ProductItem } from 'src/app/core/models/Product';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { TempStorageItem } from '../../../../../core/models/TempStorage';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styleUrls: ['./check-stock.component.scss']
})
export class CheckStockComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  myGroup = new FormGroup({
    search: new FormControl(null, Validators.required)
  });
  filteredProducts: ProductItem[];
  isLoading = false;

  storages: TempStorageItem[];
  loading = false;

  dataSource = new MatTableDataSource();
  columns = ['image', 'cellarName', 'cellarDescription', 'stock'];

  constructor(
    public productService: ProductService,
    public tempStorageService: TempStorageService
  ) { }

  ngOnInit(): void {
    this.myGroup.get('search').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.searchByIndex(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts = data['products'];
      });

      setTimeout(() => {
        this.search.nativeElement.focus();
      }, 500);
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  searchStock(product: ProductItem) {
    this.loading = true;
    this.tempStorageService.searchByProduct(product._id)
      .subscribe((storages: TempStorageItem[]) => {
        this.storages = storages;
        this.dataSource = new MatTableDataSource<TempStorageItem>(this.storages);
        this.loading = false;
      });
  }

}
