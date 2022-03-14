import { UserItem } from './User';
import { ProviderItem } from './Provider';
import { PurchaseItem } from './Purchase';
import { ExpenseItem } from './Expense';
import { CheckItem } from './Check';

export interface AccountsPayableItem  {
  _id: string,
  _user: UserItem,
  _provider: ProviderItem,
  _purchase: PurchaseItem,
  _expense: ExpenseItem,
  date: Date,
  serie: string,
  noBill: string,
  docType: string,
  balance: AccountsPayableBalanceItem[],
  unaffectedAmount: number,
  exemptAmount: number,
  netPurchaseAmount: number,
  netServiceAmount: number,
  otherTaxes: number,
  iva: number,
  total: number,
  type: string,
  file: string,
  withholdingIVA: string,
  withholdingISR: string,
  toCredit: boolean,
  expirationCredit: Date,
  paid: boolean,
}

export interface AccountsPayableBalanceItem {
  _check: CheckItem,
  date: Date,
  document: string,
  credit: string,
  amount: number,
  file: string,
}
