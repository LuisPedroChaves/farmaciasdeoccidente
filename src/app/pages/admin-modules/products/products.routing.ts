import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { NewProductComponent } from './components/new-product/new-product.component';

export const ProductsRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'product/:action',
    component: NewProductComponent,
  },
];
