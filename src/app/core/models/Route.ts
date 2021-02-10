import { UserItem } from './User';
import { OrderItem } from './Order';
import { CellarItem } from './Cellar';

export interface RouteItem {
    _id?: string,
    _user: UserItem,
    _cellar: CellarItem,
    noRoute: Number,
    date?: Date,
    details: RouteDetailItem[],
    state: string,
    timeFinish?: Date,
}

export interface RouteDetailItem {
    _order: OrderItem,
}
