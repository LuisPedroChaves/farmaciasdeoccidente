import { RoleItem } from './Role';

export interface UserItem {
    _id?: string;
    _role: RoleItem;
    name: string,
	username: string,
	password?: string,
	imageIndex: number,
	email: string,
}
