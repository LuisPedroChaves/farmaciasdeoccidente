import { CellarItem } from './Cellar';
import { CustomerItem } from './Customer';
import { UserItem } from './User';

export interface OrderItem {
	_id?: string,
    _cellar: CellarItem,
    _customer?: CustomerItem,
    _user: UserItem,
    _delivery?: UserItem,
    _userDeleted?: UserItem,
    noOrder: string,
    noBill: string,
    nit: string,
    name: string,
    phone: string,
    address: string,
    town: string,
    department: string,
    details: string,
    payment: string,
    sellerCode?: string,
    total: number,
    state: string,
    date: string,
    timeOrder: string,
    timeDispatch?: string,
    timeSend?: string,
    timeDelivery?: string,
    textReturned?: string,
    textDeleted?: string,
    deleted?: boolean
}
