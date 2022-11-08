import { EmployeeJobItem } from "./EmployeeJob";


export interface PayrollItem {
    _id?: string;
    description: string;
    date: string;
    total: number | string;
    state: string; // borrador, pagada, generada
    details?: PayrollDetailItem[];
}


export interface PayrollDetailItem {
    _employeeJob: string | EmployeeJobItem;

    // bonifications
    incentiveBonus: number; // 250 por defecto *****
    jobBonus: number; // *****  Horas extras, Comisiones, Bonos
    otherBonus: number; // *****

    // IGSS
    igss: number; // 4.83% sobre el total del puesto

    // discounts
    productCharges: number; // ****** 
    credits: number; // *****
    foults: number; // ***** citaIGSS, foults, permissions, IGSSsuspentions, temporalSuspention



    total: number;
}