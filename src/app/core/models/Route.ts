import { UserItem } from './User';
import { OrderItem } from './Order';

export interface RouteItem {
    _id?: string,
    _user: UserItem,
    noRoute: Number,
    date?: Date,
    details: RouteDetailItem[],
    state: string,
    timeFinish?: Date,
}

export interface RouteDetailItem {
    _order: OrderItem,
}
