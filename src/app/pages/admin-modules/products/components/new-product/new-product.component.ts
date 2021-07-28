import {
  Component,
  OnInit,
  AfterContentInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CustomerItem } from 'src/app/core/models/Customer';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { OrderItem } from '../../../../../core/models/Order';
import { map, startWith } from 'rxjs/operators';
import { BrandItem } from '../../../../../core/models/Brand';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { ProductItem } from '../../../../../core/models/Product';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  loading = false;

  form = new FormGroup({
    brand: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    wholesale_price: new FormControl(null, [Validators.required]),
    distributor_price: new FormControl(null, [Validators.required]),
    retail_price: new FormControl(null, [Validators.required]),
  });

  time = 0;
  display;
  interval;

  // Autocompletado
  orderFind = false;
  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;
  product: ProductItem;

  // Sucursales
  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  constructor(
    public dialogRef: MatDialogRef<NewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    public cellarService: CellarService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.product = this.data.product;
      this.form = new FormGroup({
        brand: new FormControl(this.data.product._brand.name, [
          Validators.required,
        ]),
        code: new FormControl(this.data.product.code, [Validators.required]),
        description: new FormControl(this.data.product.description, [
          Validators.required,
        ]),
        wholesale_price: new FormControl(this.data.product.wholesale_price, [
          Validators.required,
        ]),
        distributor_price: new FormControl(
          this.data.product.distributor_price,
          [Validators.required]
        ),
        retail_price: new FormControl(this.data.product.retail_price, [
          Validators.required,
        ]),
      });
    }

    this.startTimer();

    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data) => {
        this.cellars = data;
      });
    this.filteredOptions = this.form.controls.brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
    this.cellarService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
    this.cellarsSubscription?.unsubscribe();
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time);
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + '.' + (value - minutes * 60);
  }

  // Autocompletado
  findThis(value): void {
    this.orderFind = false;
    const index = this.brands.findIndex((b) => b.name === value);
    if (index > -1) {
      this.orderFind = true;
    }
  }

  private _filter(value: string): BrandItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      const aux = this.options.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );

      return aux;
    } else {
      return [];
    }
  }

  saveProduct(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    if (this.data) {
      const brand = this.searchBrand(this.form.value.brand);
      console.log('we will edit', 'brand: ' + brand);

      this.product._brand = brand;
      this.product.code = this.form.value.code;
      this.product.description = this.form.value.description;
      this.product.wholesale_price = this.form.value.wholesale_price;
      this.product.distributor_price = this.form.value.distributor_price;
      this.product.retail_price = this.form.value.retail_price;

      this.productService.updateProduct(this.product).subscribe(
        (data) => {
          console.log(data);
          if (data.ok === true) {
            this.toasty.success('Producto editada exitosamente');
            this.dialogRef.close('ok');
            this.loading = false;
          } else {
            this.loading = false;
            this.toasty.error('Error al editar el Producto');
          }
        },
        (error) => {
          this.loading = false;
          this.toasty.error('Error al editar el Producto');
        }
      );
      console.log(this.product);
    } else {
      console.log('we will create');

      this.product = { ...this.form.value };

      const brand = this.searchBrand(this.form.value.brand);
      this.product._brand = brand;

      this.productService.createProduct(this.product).subscribe(
        (data) => {
          console.log(data);

          if (data.ok === true) {
            this.toasty.success('Producto creado exitosamente');
            this.dialogRef.close('ok');
            this.loading = false;
          } else {
            this.loading = false;
            this.toasty.error('Error al crear la producto');
          }
        },
        (err) => {
          this.loading = false;
          this.toasty.error('Error al crear la Producto');
        }
      );
    }
  }

  searchBrand(search: string): BrandItem {
    let brand: BrandItem = this.brands.find((e) => e._id === search);
    if (!brand) {
      return (brand = { name: search });
    }
    return brand;
  }
}
