
export interface RoleItem {
    _id?: string;
    name: string;
    permissions: PermissionItem[];
}


export interface PermissionItem {
    _id?: string;
    name: string;
    label: string;
    parent: string;
    company: string;
    level: number;
    options: string[];
    selected: boolean;
}
