import { AfterContentInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem, InternalOrderItemFull } from 'src/app/core/models/InternalOrder';
import { ProductAddedItem, ProductItem, ProductItemResponse } from 'src/app/core/models/Product';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';


@Component({
  selector: 'app-new-request-new',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit, AfterContentInit, OnDestroy {

  form = new FormGroup({
    _cellar: new FormControl(null, [Validators.required]),
    _destination: new FormControl(null),
    noOrder: new FormControl(null, [Validators.required]),
    details: new FormControl(null),
    file: new FormControl(null),
    type: new FormControl('PEDIDO'),
  });

  // Sucursales tipo bodega
  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  @Input() currentCellar: CellarItem;
  @Input() smallScreen: boolean;
  

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<ProductItem[]>;
  @Input() products: ProductItem[] = [];
  currentProduct: ProductItem;
  @Input() addedProducts: ProductAddedItem[] = [];
  @Input() type: string;
  aFindEdit: boolean = false;
  quantity: number = null;
  loading: boolean = false;
  filteredProducts: Observable<ProductItem[]>[] = [];
  isLoading = false;


  
  constructor(public cellarService: CellarService, public internalOrderService: InternalOrderService, public toasty: ToastyService, public productService: ProductService) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data.filter(cellar => cellar.type === 'BODEGA');
    });
    this.form = new FormGroup({
      _cellar: new FormControl(this.currentCellar, [Validators.required]),
      _destination: new FormControl(null),
      noOrder: new FormControl(null, [Validators.required]),
      details: new FormControl(null),
      file: new FormControl(null),
      type: new FormControl(this.type),
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








  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATIONAL FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getType() {
    switch(this.form.controls.type.value) {
      case 'PEDIDO': return 'Sin tipo';
      case 'URGENTE': return 'Urgente';
      case 'REPOSICION': return 'Reposición';
      case 'INGRESOS': return 'Nuevo Ingreso';
      case 'FALTANTES': return 'Faltantes';
      default: return 'Sin tipo';
    }
  }



  private _filter(value: string): ProductItem[] {
    if (value !== null) {
      const filterValue = value.toLocaleLowerCase();
      return this.products.filter(prod => prod.code.toString().toLocaleLowerCase().includes(filterValue) || prod.description.toLocaleLowerCase().includes(filterValue) || prod.barcode.toLocaleLowerCase().includes(filterValue) || prod._brand.name.toLocaleLowerCase().includes(filterValue));
    } else {
       return this.products;
    }
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
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


  findThisEdit(value) {
    this.aFindEdit = false;
    let aFinded: ProductItem;
    const index = this.products.findIndex(ac => ac.description === value);
    if (index > -1) {
      this.aFindEdit = true;
      aFinded = this.products[index];
      this.currentProduct = aFinded;
    } else {
      this.currentProduct = undefined;
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


  saveInternalOrder() {
    if (this.form.invalid) { return; }
    if (this.addedProducts.length === 0) { this.toasty.warning('Debe agregar productos a la lista'); }
    this.loading = true;
    let internalOrder: InternalOrderItemFull = { ...this.form.value, detail: this.addedProducts,  };
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





}
