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
  action: string;

  product: ProductItem;

  constructor(
    public productService: ProductService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      const action = params.action;
      const productToFind = params.product;

      if (action) {
        if (action === 'edit') {
          console.log(action, productToFind);
          this.productService
            .findById(productToFind)
            .subscribe(({ product }) => {
              console.log('searching founded');
              if (product) {
                console.log(product);

                this.product = product;
                this.action = action;
              }
            });
        } else {
          this.action = action;
          console.log(action);
        }
      }
    });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}

  ngOnDestroy(): void {}
}
