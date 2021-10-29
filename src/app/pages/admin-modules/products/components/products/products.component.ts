import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/core/store/app.reducer';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ProductsDataSource } from 'src/app/core/services/cdks/product.datasource';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ProductItem } from 'src/app/core/models/Product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') search: ElementRef<HTMLInputElement>;
  smallScreen = window.innerWidth < 960 ? true : false;

  expandedElement: ProductItem | null;

  sessionsubscription: Subscription;
  productsp: string[];

  dataSource: ProductsDataSource;
  columns = [
    'code',
    'barcode',
    'description',
    '_brand',
    'healthProgram',
    'state',
    // 'options',
  ];
  currentPage = 0;

  constructor(
    public store: Store<AppState>,
    public productService: ProductService,
    public toasty: ToastyService,
    public router: Router,
    public dialog: MatDialog
  ) {}

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
    this.dataSource.loadProducts(this.currentPage, 10, '');
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductsPage();
        })
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadProductsPage())).subscribe();
  }

  loadProductsPage(): void {
    this.dataSource.loadProducts(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.search.nativeElement.value
    );
  }

  addNewProduct(): void {
    this.router.navigate(['admin/adminProducts/product', 'new']);
  }

  delProduct(product: ProductItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Producto',
        message:
          '¿Confirma que desea eliminar el producto:  ' +
          product.description +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.loading = true;
        this.productService.deleteProduct(product).subscribe(
          (res) => {
            this.toasty.success('Producto eliminado exitosamente');
            this.dataSource.loadProducts(this.currentPage, 10, '');
          },
          (error) => {
            // this.loading = false;
            this.toasty.error('Error al eliminar el Producto');
          }
        );
      }
    });
  }

  editProduct(product: ProductItem): void {
    this.router.navigate(['admin/adminProducts/product', 'edit', product._id]);
  }

  discontinuedProduct(product: ProductItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Desactivar Producto',
        message:
          '¿Confirma que desea desactivar el producto:  ' +
          product.description +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.loading = true;
        this.productService.discontinued(product).subscribe(
          (res) => {
            this.toasty.success('Producto desactivado exitosamente');
            this.dataSource.loadProducts(this.currentPage, 10, '');
          },
          (error) => {
            // this.loading = false;
            this.toasty.error('Error al desactivar el Producto');
          }
        );
      }
    });
  }
}
