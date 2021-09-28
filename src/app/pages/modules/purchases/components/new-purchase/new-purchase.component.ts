import {
  Component,
  OnInit,
  AfterContentInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CellarItem } from 'src/app/core/models/Cellar';
import { ProviderService } from '../../../../../core/services/httpServices/provider.service';
import { ProviderItem } from '../../../../../core/models/Provider';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { ProductItem } from '../../../../../core/models/Product';
import {
  PurchaseDetailItem,
  PurchaseItem,
} from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ProductFormComponent } from '../../../../admin-modules/products/components/product-form/product-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalFormComponent } from '../../../../admin-modules/products/components/product-form/product-modal-form.component';
import { NewProviderComponent } from 'src/app/pages/admin-modules/providers/components/new-provider/new-provider.component';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewPurchaseComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  currentCellar: CellarItem;

  @ViewChild('provider') provider: ElementRef<HTMLInputElement>;

  formPurchase = new FormGroup({
    _cellar: new FormControl(null),
    _user: new FormControl(null),
    _provider: new FormControl(null, Validators.required),
    noBill: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    requisition: new FormControl(''),
    details: new FormControl(''),
    payment: new FormControl('CONTADO'),
    total: new FormControl(0, Validators.required),
    file: new FormControl(''),
  });

  formDetail = new FormGroup({
    _product: new FormControl(null, Validators.required),
    quantity: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    bonus: new FormControl(0, Validators.required),
    discount: new FormControl(0, Validators.required),
    realQuantity: new FormControl(0, Validators.required),
    expirationDate: new FormControl(''),
  });

  detailPurchase: any[] = [];

  providerSubscription: Subscription;
  providers: ProviderItem[] = [];
  filteredOptions: Observable<ProviderItem[]>;

  searchProductsCtrl = new FormControl();
  filteredProducts: ProductItem[];
  isLoading = false;

  constructor(
    public providerService: ProviderService,
    public productService: ProductService,
    public toasty: ToastyService,
    public purchaseService: PurchaseService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.providerSubscription = this.providerService
      .readData()
      .subscribe((data) => {
        this.providers = data;
      });
    this.filteredOptions =
      this.formPurchase.controls._provider.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    this.loadProducts();

    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    setTimeout(() => {
      this.provider.nativeElement.focus();
    }, 500);
  }

  loadProducts(): void {
    this.searchProductsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.search(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts = data['products'];
      });
  }

  ngAfterContentInit(): void {
    this.providerService.loadData();
  }

  ngOnDestroy(): void {
    this.providerSubscription?.unsubscribe();
  }

  private _filter(value: string): ProviderItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.providers.filter((provider) =>
        provider.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  getTotal(): number {
    let total = 0;

    this.detailPurchase.forEach((p) => {
      const t = p.quantity * p.price;
      total += t;
    });
    return total;
  }

  calcs(index: number, quantity: number, type: string): void {
    const INPUTS_VALIDOS = {
      quantity: () => {
        const REAL_QUANTITY: number =
          this.detailPurchase[index].bonus + quantity;
        this.detailPurchase[index].realQuantity = REAL_QUANTITY;
        this.detailPurchase[index].stockQuantity = this.calcStock(
          REAL_QUANTITY,
          this.detailPurchase[index]._product.presentations.quantity
        );
        this.calcCost(index);
      },
      price: () => {
        this.detailPurchase[index].price = quantity;
        this.calcCost(index);
      },
      bonus: () => {
        const REAL_QUANTITY: number =
          this.detailPurchase[index].quantity + quantity;
        this.detailPurchase[index].realQuantity = REAL_QUANTITY;
        this.detailPurchase[index].stockQuantity = this.calcStock(
          REAL_QUANTITY,
          this.detailPurchase[index]._product.presentations.quantity
        );
        this.calcCost(index);
      },
      discount: () => {
        this.detailPurchase[index].discount = quantity;
        this.calcCost(index);
      },
    };

    INPUTS_VALIDOS[type]();
  }

  calcStock(quantity: number, quantityPresentation: number): number {
    return quantity * quantityPresentation;
  }

  calcCost(index: number): void {
    const COST: number =
      (this.detailPurchase[index].price * this.detailPurchase[index].quantity) /
      this.detailPurchase[index].realQuantity;
    this.detailPurchase[index].cost = (
      COST -
      COST * (this.detailPurchase[index].discount / 100)
    ).toFixed(2);
  }

  addRow(product: any): void {
    this.searchProductsCtrl.setValue('');

    const INDEX = this.detailPurchase.findIndex(
      (d) =>
        d._product._id === product._id &&
        d._product.presentations._id === product.presentations._id
    );

    if (INDEX > -1) {
      this.toasty.toasty('warning', '¡El producto ya fue agregado!');
      return;
    } else {
      this.detailPurchase.push({
        _product: product,
        quantity: 1,
        price: '',
        bonus: 0,
        discount: 0,
        cost: 0,
        realQuantity: 1,
        stockQuantity: this.calcStock(1, product.presentations.quantity),
        expirationDate: null,
      });
    }
  }

  removeRow(index: number): void {
    this.detailPurchase.splice(index, 1);
  }

  savePurchase(): void {
    const INVALID: PurchaseDetailItem[] = this.detailPurchase.find(
      (detail: PurchaseDetailItem) =>
        !detail.quantity || !detail.price || !detail.realQuantity
    );

    if (INVALID) {
      this.toasty.error('Algunos valores del detalle no están completos');
      return;
    }

    this.loading = true;
    this.formPurchase.get('_cellar').setValue(this.currentCellar);
    this.formPurchase.get('total').setValue(this.getTotal());
    let purchase: PurchaseItem = { ...this.formPurchase.value };
    purchase.detail = this.detailPurchase;

    this.purchaseService.createPurchase(purchase).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Compra creada exitosamente');
          this.router.navigate(['/purchases']);
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al crear la compra');
        }
      },
      (err) => {
        this.loading = false;
        this.toasty.error('Error al crear la compra');
      }
    );
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductModalFormComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: {
        by: 'NewPurchase',
      },

      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loadProducts();
      }
    });
  }
  addProvider(): void {
    const dialogRef = this.dialog.open(NewProviderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: {
        by: 'NewPurchase',
      },

      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.providerService.loadData();
      }
    });
  }
}
