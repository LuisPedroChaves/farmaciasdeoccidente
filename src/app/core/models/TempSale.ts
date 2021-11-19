import { CellarItem } from './Cellar';
import { ProductItem } from './Product';

export interface TempSaleItem {
    _cellar: CellarItem;
    _product: ProductItem;
    date: Date,
    quantity: number,
}
