import { EmployeeJobItem } from "./EmployeeJob";

export interface DiscountItem {
    _id?: string;
    _employeeJob: EmployeeJobItem,
    date: string;
    type: string;
    hours: string | number;
    amount: string | number;
    approved: boolean;
    hasDiscount: boolean;
    applied: boolean;
}