import { AccountsPayableItem } from './AccountsPayable';
import { BankAccountItem } from './Bank';
import { CashRequisitionItem } from './CashRequisition';
import { UserItem } from './User';

export interface CheckItem {
    _id?: string,
    _user?: UserItem,
    _bankAccount: BankAccountItem,
    no: string,
    city: string,
    date: Date,
    name: string,
    code?: string,
    nit?: string,
    amount: number,
    note: string,
    receipt?: ICheckReceipt,
    accountsPayables: AccountsPayableItem[],
    cashRequisitions: CashRequisitionItem[],
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