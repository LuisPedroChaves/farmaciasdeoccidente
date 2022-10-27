import { EmployeeJobItem } from "./EmployeeJob";

export interface RisingItem {
    _id?: string;
    _employeeJob: string | EmployeeJobItem;
    date: string;
    type: string;
    details: string;
    hours: number | string;
    amount: number | string;
    approved: boolean;
    applied: string;
}