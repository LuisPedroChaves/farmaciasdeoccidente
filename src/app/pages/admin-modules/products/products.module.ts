import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsRoutes } from './products.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { ProductsComponent } from './components/products/products.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { CoreModule } from 'src/app/core/core.module';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProductModalFormComponent } from './components/product-form/product-modal-form.component';

@NgModule({
  declarations: [
    ProductsComponent,
    NewProductComponent,
    ProductFormComponent,
    EditProductComponent,
    ProductModalFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductsRoutes),
    CoreModule,
    SharedComponentsModule,
  ],
})
export class ProductsModule {}
