import { BrandItem } from './Brand';
import { SubstanceItem } from './Substance';
import { SymptomItem } from './Symptom';

export interface ProductItem {
  _id?: string;
  _brand: BrandItem;
  code: string;
  barcode: string;
  description: string;
  healthProgram: string;
  wholesale_price: number;
  distributor_price: number;
  retail_price: number;
  cf_price: number;
  presentations: ProductPresentationsItem[];
  substances: string[];
  symptoms: string[];
  exempt: boolean;
  discontinued: boolean;
}

export interface ProductPresentationsItem {
  _id?: string;
  name: string;
  wholesale_price: number;
  distributor_price: number;
  retail_price: number;
  cf_price: number;
  quantity: number;
  commission: number;
}
// export interface ProductSubstancesItem {
//   _substance: SubstanceItem;
// }
// export interface ProductSymptomsItem {
//   _symptom: SymptomItem;
// }