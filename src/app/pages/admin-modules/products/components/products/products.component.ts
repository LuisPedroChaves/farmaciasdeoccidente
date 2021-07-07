import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { ProductItem } from 'src/app/core/models/Product';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  productsSubscription: Subscription;

  products: ProductItem[];
  productsp: string[];

  dataSource = new MatTableDataSource();
  columns = ['code', 'description', '_brand', 'wholesale_price', 'distributor_price', 'retail_price', 'cf_price'];
  currentPage = 1;

  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'adminProducts');
        this.productsp = b.length > 0 ? b[0].options : [];
      }
    });

    this.loadProducts();
  }

  ngAfterContentInit(): void {
    const FILTERS = {
      page: this.currentPage,
    };
    this.productService.loadData(FILTERS);
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
  }

  loadProducts(): void {
    this.productsSubscription = this.productService.readData().subscribe(data => {
      console.log("🚀 ~ file: products.component.ts ~ line 67 ~ ProductsComponent ~ this.productsSubscription=this.productService.readData ~ data", data)
      this.products = data;
      this.dataSource = new MatTableDataSource(this.products);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
