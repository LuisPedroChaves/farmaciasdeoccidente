import { BankItem } from "./Bank";
import { CellarItem } from "./Cellar";

export interface EmployeeItem {
    _id?: string; ///////


    // GENERAL INFO
    photo: string; 
    name: string;  ///////
    lastName: string; ///////
    birth: string | Date; 
    gender: string;
    code: string; 

    docType: string; ///////
    document: string; ///////
    nit: string; 
    maritalStatus: string;  ///////
    email: string; 

    address: string; 
    department: string; 
    city: string; 




    nationality: string;
    disability: string;
    foreignPermit: string;
    igssNumber: string;
    village: string; // Maya, Garifuna, Xinca, Ladino, Otro
    linguisticCommunity: string; // Otro, Español, Achi, Akateko, Awakateko, Chalchiteko, Ch’orti’, Chuj, Garífuna, Itza, Ixil, Kaqchikel, K’iche’, Mam, Mopan, Popti, Poqomam, Poqomchi’, Q’anjobal’, Q’eqchi, Sacapulteko, Sipakapense, Tektiteko, Tz’utujil, Uspanteko, Xinka,



    // LABORAL INFO
    profession: string; 
    academicLavel: string; 
    _bank: string | BankItem; 
    bankAccount: string; 
    igss: boolean; 
    benefits: boolean; 
    _cellar: string | CellarItem; 
    details: string; 

    vacationDate: string; 
    lastVacationDate: string; 


    family: FamilyItem[]; 
    fired: string; 
}


export interface FamilyItem {
    name: string;
    birth: string;
    type: string;
}