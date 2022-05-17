import { UserItem } from './User';

export interface CashItem{
    _id?: string,
    _admin: UserItem,
    _user: UserItem,
    type: string,
    balance: number,
    created: string,
    updated: string,
}