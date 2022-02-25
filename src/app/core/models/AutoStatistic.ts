import { UserItem } from './User';
import { CellarItem } from './Cellar';
import { BrandItem } from './Brand';

export interface AutoStatisticItem {
  _id?: string,
  _user: UserItem,
  name: string,
  hour: number,
  minute: number,
  cellars: CellarItem[],
  brands: BrandItem[],
  daysRequest: number,
  daysSupply: number,
  note: string,
  date: Date,
  updated: string,
  activated: boolean,
}
