import { AccountsPayableItem } from './AccountsPayable';
import { UserItem } from './User';

export interface CheckItem {
    _id?: string,
    _user?: UserItem,
    no: string,
    city: string,
    date: Date,
    name: string,
    amount: number,
    note: string,
    receipt?: ICheckReceipt,
    accountsPayables: AccountsPayableItem[],
    paymentDate?: Date,
    bank: string,
    state: string,
    delivered?: boolean,
    created?: Date,
}

export interface ICheckReceipt {
    no: string,
    file: string,
}