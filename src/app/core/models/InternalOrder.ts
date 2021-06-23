import { CellarItem } from './Cellar';
import { UserItem } from './User';

export interface InternalOrderItem {
	_id?: string,
    _cellar: CellarItem,
    _user: UserItem,
    _delivery?: UserItem,
    _destination: CellarItem,
    noOrder: string,
    date: string,
    details: string,
    type: string,
    state: string,
    timeInit: string,
    timeDispatch?: string,
    timeDelivery?: string,
    file: string,
    dispatchFile: string,
    deleted?: boolean
}
