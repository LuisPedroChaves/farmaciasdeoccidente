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


export interface TransactionItem {
    _id?: string;
    _employeeJob: string | EmployeeJobItem;
    date: string;
    type: string;
    details: string;
    hours: number | string;
    amount: number | string;
    applied: string;
    approved: boolean;
    hasDiscount: boolean;
    transactionType: 'permission' | 'rising';
}