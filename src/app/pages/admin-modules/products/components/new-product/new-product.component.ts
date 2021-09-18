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
import { ActivatedRoute } from '@angular/router';
import { ProductsDataSource } from 'src/app/core/services/cdks/product.datasource';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  loading = false;
  action: string;
  dataRoute: any;

  dataSource: ProductsDataSource;
  product: ProductItem;

  constructor(
    // public dialogRef: MatDialogRef<NewProductComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      const action = params.action;
      this.dataRoute = action.split('/');
      if (action && this.dataRoute.length !== 0) {
        if (this.dataRoute[0] === 'edit') {
          this.productService
            .search(this.dataRoute[1])
            .subscribe(({ products }) => {
              if (products.length > 0) {
                this.product = products[0];
                this.action = this.dataRoute[0];
              }
            });
        }
      }
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    // this.brandService.loadData();
  }

  ngOnDestroy(): void {
    // this.brandsSubscription?.unsubscribe();
  }

  // saveProduct(): void {
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   this.loading = true;

  //   if (this.data) {
  //     console.log('we will edit', 'brand: ');

  //     this.product._brand = { name: this.form.value.brand };
  //     this.product.code = this.form.value.code;
  //     this.product.description = this.form.value.description;
  //     this.product.wholesale_price = this.form.value.wholesale_price;
  //     this.product.distributor_price = this.form.value.distributor_price;
  //     this.product.retail_price = this.form.value.retail_price;

  //     this.productService.updateProduct(this.product).subscribe(
  //       (data) => {
  //         console.log(data);
  //         if (data.ok === true) {
  //           this.toasty.success('Producto editada exitosamente');
  //           // this.dialogRef.close('ok');
  //           this.loading = false;
  //         } else {
  //           this.loading = false;
  //           this.toasty.error('Error al editar el Producto');
  //         }
  //       },
  //       (error) => {
  //         this.loading = false;
  //         this.toasty.error('Error al editar el Producto');
  //       }
  //     );
  //     console.log(this.product);
  //   } else {
  //     console.log('we will create');

  //     this.product = { ...this.form.value };
  //     this.product._brand = { name: this.form.value.brand };

  //     this.productService.createProduct(this.product).subscribe(
  //       (data) => {
  //         console.log(data);

  //         if (data.ok === true) {
  //           this.toasty.success('Producto creado exitosamente');
  //           // this.dialogRef.close('ok');
  //           this.loading = false;
  //         } else {
  //           this.loading = false;
  //           this.toasty.error('Error al crear la producto');
  //         }
  //       },
  //       (err) => {
  //         this.loading = false;
  //         this.toasty.error('Error al crear la Producto');
  //       }
  //     );
  //   }
  // }
}
