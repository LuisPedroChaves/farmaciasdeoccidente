import { Component, OnInit, AfterContentInit, OnDestroy, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CellarItem } from 'src/app/core/models/Cellar';
import { ProviderService } from '../../../../../core/services/httpServices/provider.service';
import { ProviderItem } from '../../../../../core/models/Provider';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { ProductItem } from '../../../../../core/models/Product';
import { PurchaseDetailItem, PurchaseItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, AfterContentInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  currentCellar: CellarItem;

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
    file: new FormControl('')
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.providerSubscription = this.providerService.readData().subscribe(data => {
      this.providers = data;
    });
    this.filteredOptions = this.formPurchase.controls._provider.valueChanges.pipe(startWith(''), map(value => this._filter(value)));

    this.searchProductsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap(value => this.productService.search(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredProducts = data['products'];
      });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  ngAfterContentInit() {
    this.providerService.loadData();
  }

  ngOnDestroy() {
    this.providerSubscription?.unsubscribe();
  }

  private _filter(value: string): ProviderItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.providers.filter(provider => provider.name.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  calcs(index: number, quantity: number, type: string): void {
    const INPUTS_VALIDOS = {
      'quantity': () => {
        const REAL_QUANTITY: number = this.detailPurchase[index].bonus + quantity;
        this.detailPurchase[index].realQuantity = REAL_QUANTITY;
        this.detailPurchase[index].stockQuantity = this.calcStock(REAL_QUANTITY, this.detailPurchase[index]._product.presentations.quantity);
      },
      'price': () => this.detailPurchase[index].cost = quantity,
      'bonus': () => {
        const REAL_QUANTITY: number = this.detailPurchase[index].quantity + quantity;
        this.detailPurchase[index].realQuantity = REAL_QUANTITY;
        this.detailPurchase[index].stockQuantity = this.calcStock(REAL_QUANTITY, this.detailPurchase[index]._product.presentations.quantity);
        this.detailPurchase[index].cost = ((this.detailPurchase[index].price * this.detailPurchase[index].quantity) / REAL_QUANTITY).toFixed(2);
      },
      'discount': () => {
        const DISCOUNT = quantity / 100;
        this.detailPurchase[index].cost = ((this.detailPurchase[index].cost - (this.detailPurchase[index].price * DISCOUNT))).toFixed(2);
      },
    }

    INPUTS_VALIDOS[type]();
  }

  getTotal(): number {
    let total = 0;

    this.detailPurchase.forEach(p => {
      const t = p.quantity * p.price;
      total += t;
    });
    return total;
  }

  calcStock(quantity: number, quantityPresentation: number): number {
    return quantity * quantityPresentation;
  }

  addRow(product: any) {
    this.searchProductsCtrl.setValue('');

    const INDEX = this.detailPurchase.findIndex(d => (d._product._id === product._id && d._product.presentations._id === product.presentations._id));

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
        expirationDate: null
      });
    }
  }

  removeRow(index: number): void {
    this.detailPurchase.splice(index, 1);
  }

  savePurchase() {

    const INVALID: PurchaseDetailItem[] = this.detailPurchase.find((detail: PurchaseDetailItem) => !detail.quantity || !detail.price || !detail.realQuantity);

    if (INVALID) {
      this.toasty.error('Algunos valores del detalle no están completos');
      return
    }

    this.loading = true;
    this.formPurchase.get('_cellar').setValue(this.currentCellar);
    let purchase: PurchaseItem = { ...this.formPurchase.value };
    purchase.detail = this.detailPurchase;

    this.purchaseService.createPurchase(purchase).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Compra creada exitosamente');
        this.router.navigate(['/purchases']);
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear la compra');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear la compra');
    });
  }

}
