import { AccountsPayableItem } from './AccountsPayable';
import { BankAccountItem } from './Bank';
import { UserItem } from './User';

export interface CheckItem {
    _id?: string,
    _user?: UserItem,
    _bankAccount: BankAccountItem,
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
    voided?: boolean,
    created?: Date,
}

export interface ICheckReceipt {
    no: string,
    name: string,
    file: string,
}