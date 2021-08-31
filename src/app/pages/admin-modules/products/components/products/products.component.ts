import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/core/store/app.reducer';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ProductsDataSource } from 'src/app/core/services/cdks/product.datasource';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  productsp: string[];

  dataSource: ProductsDataSource;
  columns = [
    'code',
    'description',
    '_brand',
    'wholesale_price',
    'distributor_price',
    'retail_price',
    'cf_price',
    'options',
  ];
  currentPage = 1;

  constructor(
    public store: Store<AppState>,
    public productService: ProductService,
    public toasty: ToastyService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store
      .select('session')
      .pipe(filter((session) => session !== null))
      .subscribe((session) => {
        if (session.permissions !== null) {
          const b = session.permissions.filter(
            (pr) => pr.name === 'adminProducts'
          );
          this.productsp = b.length > 0 ? b[0].options : [];
        }
      });

    this.dataSource = new ProductsDataSource(this.productService);
    this.dataSource.loadProducts(this.currentPage, 20);
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => this.loadLessonsPage())
      )
      .subscribe();
  }

  loadLessonsPage() {
    this.dataSource.loadProducts(
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  addNewProduct(): void {
    this.router.navigate(['admin/adminProducts/product', 'new']);
  }

}
