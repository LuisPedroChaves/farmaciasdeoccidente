import { CellarItem } from './Cellar';
import { ProductItem } from './Product';

export interface TempStorageItem {
  _cellar: CellarItem;
  _product: ProductItem;
  stock: number;
  supply: number;
  minStock: number;
  maxStock: number;
}
