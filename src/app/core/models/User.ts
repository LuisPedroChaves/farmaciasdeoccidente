import { RoleItem } from './Role';
import { CellarItem } from './Cellar';
import { RouteItem } from './Route';
import { InternalOrderItem } from './InternalOrder';
import { EmployeeItem } from './Employee';

export interface UserItem {
    _id?: string;
    _role: RoleItem;
    _cellar?: CellarItem;
    name: string,
	username: string,
	password?: string,
	imageIndex: number,
    _employee?: EmployeeItem | string;
	email: string,
    activeRoutes?: RouteItem[],
    internalOrders?: InternalOrderItem[]
}
