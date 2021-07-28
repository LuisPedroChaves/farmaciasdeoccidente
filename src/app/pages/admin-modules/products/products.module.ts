import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsRoutes } from './products.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ProductsComponent } from './components/products/products.component';
import { NewProductComponent } from './components/new-product/new-product.component';



@NgModule({
  declarations: [ProductsComponent, NewProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductsRoutes),
    SharedComponentsModule
  ]
})
export class ProductsModule { }
