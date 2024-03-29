import { UserItem } from './User';
import { CashItem } from './Cash';

export interface CashFlowItem {
    _id?: string,
    _user: UserItem,
    _cash: CashItem,
    date: Date,
    serie: string,
    noBill: string,
    details: string,
    state: string,
    income: number,
    expense: number,
    balance: number,
    created: string | Date,
    updated: string,
}