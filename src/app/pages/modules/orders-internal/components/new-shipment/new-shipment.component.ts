import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItemFull } from 'src/app/core/models/InternalOrder';
import { ProductAddedItem, ProductItem } from 'src/app/core/models/Product';
import { UserItem } from 'src/app/core/models/User';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-new-shipment',
  templateUrl: './new-shipment.component.html',
  styleUrls: ['./new-shipment.component.scss']
})
export class NewShipmentComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() smallScreen: boolean;
  ORDER: InternalOrderItemFull;
  @Output() saving = new EventEmitter<any>();
  @Input() delivers:  UserItem[] = [];
  currentDeliver:  UserItem[] = [];
  loading: boolean = false;

  dispatchProducts: ProductAddedItem[] = [];


  form = new FormGroup({
    _cellar: new FormControl(null, [Validators.required]),
    _destination: new FormControl(null),
    noOrder: new FormControl(null, [Validators.required]),
    details: new FormControl(null),
    file: new FormControl(null),
    type: new FormControl('PEDIDO'),
    _deliver: new FormControl(null),
  });

  // Sucursales tipo bodega
  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  @Input() currentCellar: CellarItem;

  addedProducts: ProductAddedItem[] = [];
  type: string;
  aFindEdit: boolean = false;
  quantity: number = null;
  currentProduct: ProductItem;
  myControl = new FormControl();

  products: ProductItem[] = [];

  filteredProducts: Observable<ProductItem[]>[] = [];
  isLoading = false;
  filteredOptions: Observable<ProductItem[]>;
  currentUser: UserItem;
  constructor(public toasty: ToastyService, public store: Store<AppState>, public internalOrderService: InternalOrderService, public cellarService: CellarService, public productService: ProductService) { }

  ngOnInit(): void {

    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });
    this.form = new FormGroup({
      _cellar: new FormControl(this.currentCellar, [Validators.required]),
      _destination: new FormControl(null),
      noOrder: new FormControl(null, [Validators.required]),
      details: new FormControl(null),
      file: new FormControl(null),
      type: new FormControl(this.type),
      _deliver: new FormControl(null),
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.manageProductControl();
  }


  ngAfterContentInit() {
    this.cellarService.loadData();
  }

  ngOnDestroy() {
    this.cellarsSubscription?.unsubscribe();
  }

  private _filter(value: string): ProductItem[] {
    if (value !== null) {
      const filterValue = value.toLocaleLowerCase();
      return this.products.filter(prod => prod.code.toString().toLocaleLowerCase().includes(filterValue) || prod.description.toLocaleLowerCase().includes(filterValue) || prod.barcode.toLocaleLowerCase().includes(filterValue) || prod._brand.name.toLocaleLowerCase().includes(filterValue));
    } else {
       return this.products;
    }
  }


  getType() {
    switch(this.form.controls.type.value) {
      case 'PEDIDO': return 'Sin tipo';
      case 'REPOSICION': return 'Reposición';
      case 'INGRESOS': return 'Nuevo Ingreso';
      case 'FALTANTES': return 'Faltantes';

    }
  }


  add() {
    this.aFindEdit = false;
    if (this.quantity === 0 || this.myControl.value === undefined) { return; }
    this.currentProduct = this.myControl.value;
    const index = this.addedProducts.findIndex(p => p._product._id === this.currentProduct._id);
    if (index > -1) {} else {
      this.addedProducts.push({
        _product: this.currentProduct,
        quantity: this.quantity,
        stock: 0
      });
      this.quantity = null;
      this.currentProduct = undefined;
      this.myControl.setValue(null);
    }
  }


  remove(p: ProductAddedItem) {
    const index = this.addedProducts.findIndex(pr => pr._product._id === p._product._id);
    if (index > -1) {
      this.addedProducts.splice(index, 1);
    }
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }


  saveInternalOrder() {
    if (this.form.invalid) { return; }
    if (this.addedProducts.length === 0) { this.toasty.warning('Debe agregar productos a la lista'); }
    this.loading = true;
    let internalOrder: InternalOrderItemFull = {
      _cellar: this.currentCellar,
      _user: null,
      _delivery: this.form.controls._deliver.value,
      _destination: this.form.controls._destination.value,
      noOrder: this.form.controls.noOrder.value,
      date: null,
      details: this.form.controls.details.value,
      type: this.form.controls.type.value,
      state: 'DESPACHO',
      timeInit: null,
      timeDispatch: null,
      timeDelivery: null,
      detail: this.addedProducts,
    };
    this.internalOrderService.createInternalOrder(internalOrder).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Pedido creado exitosamente');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear el pedido');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear el pedido');
    });
  }


  manageProductControl() {
    this.myControl.valueChanges.pipe(
        debounceTime(500),
        tap(() => { this.filteredProducts = []; this.isLoading = true; }),
      ).subscribe((data) => {
        if (typeof data === 'string') {
          this.productService.search(data).subscribe(prods => {
            this.filteredProducts = prods['products'];
            this.isLoading = false;
          });
        }
      });
  }

}
