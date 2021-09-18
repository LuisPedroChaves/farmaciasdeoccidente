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
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
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
    cf_price: new FormControl(null, [Validators.required]),
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
  public data: any;

  constructor(
    // public dialogRef: MatDialogRef<NewProductComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService
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
        cf_price: new FormControl(this.data.product.cf_price, [
          Validators.required,
        ]),
      });
    }

    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  // Autocompletado
  findThis(value): void {
    this.orderFind = false;
    const index = this.brands.findIndex((b) => b.name === value);
    if (index > -1) {
      this.orderFind = true;
    }
  }

  saveProduct(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    if (this.data) {
      console.log('we will edit', 'brand: ');

      this.product._brand = { name: this.form.value.brand };
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
            // this.dialogRef.close('ok');
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
      this.product._brand = { name: this.form.value.brand };

      this.productService.createProduct(this.product).subscribe(
        (data) => {
          console.log(data);

          if (data.ok === true) {
            this.toasty.success('Producto creado exitosamente');
            // this.dialogRef.close('ok');
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
}
