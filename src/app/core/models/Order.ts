import { CellarItem } from './Cellar';
import { CustomerItem } from './Customer';
import { UserItem } from './User';

export interface OrderItem {
	_id?: string,
    _cellar: CellarItem,
    _customer?: CustomerItem,
    _user: UserItem,
    noOrder: string,
    noBill: string,
    details: string,
    payment: string,
    total: number,
    state: string,
    createdAt: string,
    timeOrder: string,
    timeDispatch?: string,
    timeSend?: string,
    timeDelivery?: string,
}
