import { CellarItem } from './Cellar';
import { UserItem } from './User';
import { ProviderItem } from './Provider';
import { ProductItem } from './Product';

export interface PurchaseItem {
    _id: string,
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
    state: string,
    created: Date,
    _lastUpdate: UserItem,
    _userDeleted: UserItem,
    textDeleted: string,
    deleted: boolean
}

export interface PurchaseDetailItem {
    _product: ProductItem;
    presentation: PurchaseDetailPresentationItem,
    requested: number,
    quantity: number,
    price: number,
    bonus: number,
    discount: number,
    cost: number,
    realQuantity: number,
    expirationDate: Date,
    lastCost: number,
    updated: boolean
}

export interface PurchaseDetailPresentationItem {
    name: string,
    quantity: number
}

export interface PurchaseAdjustItem {
    _user: UserItem;
    _product: ProductItem;
    date: Date,
    quantity: number,
    details: string
}
