
export interface RoleItem {
    _id?: string;
    name: string;
    type: string;
    permissions: PermissionItem[];
}


export interface PermissionItem {
    _id?: string;
    name: string;
    label: string;
    parent: string;
    type: string;
    level: number;
    options: string[];
    selected: boolean;
}
