import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products/products.component';
import { RouterModule } from '@angular/router';
import { ProductsRoutes } from './products.routes';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';



@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductsRoutes),
    SharedComponentsModule
  ]
})
export class ProductsModule { }
