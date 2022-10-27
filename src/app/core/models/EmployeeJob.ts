import { EmployeeItem } from "./Employee";
import { JobItem } from "./Jobs";

export interface EmployeeJobItem {
    _id?: string;
    _job:string | JobItem;
    _employee:string | EmployeeItem;
    initialSalary:string;
    salaryPerHour:string;
    monthlyHours:string;
    salaryExtraHours:string;
    lawBonus:boolean;
    bonus:string;
    startDate:string;
    contractType:string;
    contract:string;
    paymentType:string;
    workPlace:string;
    
    
    endDate:string;
    workingDay: string;
    
}