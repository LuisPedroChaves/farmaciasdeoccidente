import { UserItem } from './User';

export interface CashItem{
    _id?: string,
    _user: UserItem,
    type: string,
    balance: number,
    created: string,
    updated: string,
}