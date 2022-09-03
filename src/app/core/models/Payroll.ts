import { EmployeeJobItem } from "./EmployeeJob";


export interface PayrollItem {
    _id?: string;
    description: string;
    date: string;
    total: number | string;
    state: string;
    details: PayrollDetailItem[];
}


export interface PayrollDetailItem {
    _employeeJob: string | EmployeeJobItem;
    hoursWorked: number,
    offenses: number,
    withholdings: number,
    suspension: number,
    tempSuspension: number,
    permit: number,
    callForAttention: number,
    igss: number,
    isr: number,
    overtime: number,
    commissions: number,
    bonus: number,
    bonusOfLaw: number,
    receipt: string,
    total: number
}