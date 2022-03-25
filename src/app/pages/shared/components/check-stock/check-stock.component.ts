import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

import { CellarItem } from 'src/app/core/models/Cellar';
import { ProductItem } from 'src/app/core/models/Product';
import { TempStorageItem } from 'src/app/core/models/TempStorage';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styleUrls: ['./check-stock.component.scss']
})
export class CheckStockComponent implements OnInit {

  @Input() showPrices: boolean = false;
  @ViewChild('searchCode') searchCode: ElementRef<HTMLInputElement>;

  myGroup = new FormGroup({
    searchCode: new FormControl(null, Validators.required),
    searchDescription: new FormControl(null, Validators.required),
  });
  filteredProducts: ProductItem[];
  isLoading = false;

  selectedProduct = '';
  wholesale_price = 0
  distributor_price = 0
  retail_price = 0
  cf_price = 0

  storages: TempStorageItem[];
  loading = false;

  dataSource = new MatTableDataSource();
  columns = ['image', 'cellarName', 'availability', 'stock', 'lastUpdateStock'];

  constructor(
    public productService: ProductService,
    public tempStorageService: TempStorageService
  ) { }

  ngOnInit(): void {
    this.myGroup.get('searchDescription').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.searchCheckStock(value, 'description').pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts = data['products'];
      });

    this.myGroup.get('searchCode').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.searchCheckStock(value, 'barcode').pipe(
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
      this.searchCode.nativeElement.focus();
    }, 500);
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  searchStock(product: ProductItem) {
    this.loading = true;
    this.selectedProduct = product.description;
    if (product.presentations.length > 0) {
      const { wholesale_price, distributor_price, retail_price, cf_price } = product.presentations[0];
      this.wholesale_price = wholesale_price;
      this.distributor_price = distributor_price;
      this.retail_price = retail_price;
      this.cf_price = cf_price;
    } else {
      this.wholesale_price = 0;
      this.distributor_price = 0;
      this.retail_price = 0;
      this.cf_price = 0;
    }
    this.tempStorageService.searchByProduct(product._id)
      .subscribe((storages: TempStorageItem[]) => {
        this.storages = storages;
        this.dataSource = new MatTableDataSource<TempStorageItem>(this.storages);
        this.loading = false;
      });
  }

}
