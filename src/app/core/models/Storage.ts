import { ProductItemResponse } from './Product';
import { CellarItem } from './Cellar';
export interface StorageItem {
  _id?: string;
  product: ProductItemResponse;
  cellar: CellarItem;
  minStock: number;
  maxStock: number;
  cost: number;
  totalStock: number;
  reserve: string;
  isNew: boolean;
  isMissing: boolean;
  state: boolean;
}
