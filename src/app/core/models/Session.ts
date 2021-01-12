import { UserItem } from './User';

export interface UserSession {
    type: string;
    id: string;
    token: string;
    user: UserItem;
}
