import { CellarItem } from './Cellar';
import { UserItem } from './User';
import { ProviderItem } from './Provider';
import { ProductItem } from './Product';

export interface PurchaseItem {
    _cellar: CellarItem;
    _user: UserItem;
    _provider: ProviderItem;
    noBill: string,
    date: Date,
    requisition: string,
    details: string,
    detail: PurchaseDetailItem[],
    adjust: PurchaseAdjustItem[],
    payment: string,
    total: number
    file: string,
}

export interface PurchaseDetailItem {
    _product: ProductItem;
    quantity: number,
    price: number,
    bonus: number,
    discount: number,
    cost: number,
    realQuantity: number,
    stockQuantity: number,
    expirationDate: Date
}
export interface PurchaseAdjustItem {
    _user: UserItem;
    _product: ProductItem;
    date: Date,
    quantity: number,
    details: string
}
