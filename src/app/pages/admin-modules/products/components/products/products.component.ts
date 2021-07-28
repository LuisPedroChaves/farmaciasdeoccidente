import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { NewProductComponent } from '../new-product/new-product.component';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  productsSubscription: Subscription;

  products: ProductItem[];
  productsp: string[];

  dataSource = new MatTableDataSource();
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
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public productService: ProductService,
    public brandService: BrandService,
    public toasty: ToastyService
  ) {}

  ngOnInit(): void {
    this.brandService.getData();
    this.sessionsubscription = this.store
      .select('session')
      .pipe(filter((session) => session !== null))
      .subscribe((session) => {
        console.log('Hola :D', session);

        if (session.permissions !== null) {
          const b = session.permissions.filter(
            (pr) => pr.name === 'adminProducts'
          );
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
    this.productsSubscription = this.productService
      .readData()
      .subscribe((data) => {
        console.log(
          '🚀 ~ file: products.component.ts ~ line 67 ~ ProductsComponent ~ this.productsSubscription=this.productService.readData ~ data',
          data
        );
        this.products = data;
        this.dataSource = new MatTableDataSource(this.products);
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newProduct(): void {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result !== undefined) {
        const FILTERS = {
          page: this.currentPage,
        };
        this.productService.loadData(FILTERS);
      }
    });
  }

  editProduct(product: ProductItem): void {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { product },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result !== undefined) {
        const FILTERS = {
          page: this.currentPage,
        };
        this.productService.loadData(FILTERS);
      }
    });
  }

  delProduct(product: ProductItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Orden',
        message:
          '¿Confirma que desea eliminar el producto  ' +
          product.description +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(product).subscribe(
          (response: any) => {
            this.toasty.success('Producto eliminado exitosamente');
            const FILTERS = {
              page: this.currentPage,
            };
            this.productService.loadData(FILTERS);
          },
          (error) => {
            this.toasty.error('Error al eliminar Producto');
          }
        );
      }
    });
  }
}
