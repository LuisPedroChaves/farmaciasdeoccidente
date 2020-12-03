import { RoleItem } from './Role';

export interface UserItem {
    _id: string;
    name: string;
    username: string;
    imageIndex: number;
    _role: RoleItem;
    email: string;
}
