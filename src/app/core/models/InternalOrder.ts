import { CellarItem } from './Cellar';
import { UserItem } from './User';
import { ProductAddedItem, ProductItem } from './Product';

export interface InternalOrderItem {
	_id?: string,
    _cellar: CellarItem,
    _user: UserItem,
    _delivery?: UserItem,
    _destination: CellarItem,
    noOrder: string,
    date: string,
    details: string,
    type: string,
    state: string,
    timeInit: string,
    timeDispatch?: string,
    timeDelivery?: string,
    file: string,
    dispatchFile: string,
    deleted?: boolean
}


export interface InternalOrderFullItem extends InternalOrderItem{
    products: DetailItem[];
}

export interface DetailItem {
    quantity: number;
    product: ProductItem;
    stock: number;
}




export interface InternalOrderItemFull {
	_id?: string;
    _cellar: CellarItem;
    _user: UserItem;
    _delivery?: UserItem;
    _destination: CellarItem;
    noOrder: string;
    date: string;
    details: string;
    type: string;
    state: string;
    timeInit: string;
    timeDispatch?: string;
    timeDelivery?: string;
    file?: string;
    dispatchFile?: string;

    detail: ProductAddedItem[];
    deleted?: boolean;
}