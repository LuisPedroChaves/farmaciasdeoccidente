import { CheckItem } from './Check';

export interface BankItem {
    _id?: string,
    image: string,
    name: string,
}

export interface BankAccountItem {
    _id?: string,
    _bank: BankItem,
    no: string,
    name: string,
    balance: number,
    type: string
}

export interface BankFlowItem {
    _id?: string,
    _bankAccount: BankAccountItem,
    _check?: CheckItem,
    date: Date,
    document: string,
    details: string,
    credit: number,
    debit: number,
    balance: number,
    type: string
}