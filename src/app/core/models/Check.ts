import { AccountsPayableItem } from './AccountsPayable';
import { UserItem } from './User';

export interface CheckItem {
    _id: string,
    _user: UserItem,
    no: string,
    city: string,
    date: Date,
    name: string,
    amount: number,
    note: string,
    accountsPayables: AccountsPayableItem[],
    state: string,
    delivered: boolean
}