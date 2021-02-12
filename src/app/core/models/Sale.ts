import { CellarItem } from './Cellar';
import { CustomerItem } from './Customer';
import { UserItem } from './User';

export interface SaleItem {
    _id?: string,
    _cellar: CellarItem,
    _customer: CustomerItem,
    _seller: UserItem,
    date: Date,
    noBill: string,
    balance: SaleBalanceItem[],
    total: number,
    paid: boolean,
}

export interface SaleBalanceItem {
    _id?: string,
    date: string | Date,
    receipt: string,
    document: string,
    payment: string,
    amount: number
}
