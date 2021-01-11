import { RoleItem } from './Role';
import { CellarItem } from './Cellar';

export interface UserItem {
    _id?: string;
    _role: RoleItem;
    _cellar?: CellarItem;
    name: string,
	username: string,
	password?: string,
	imageIndex: number,
	email: string,
}
