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
  lastUpdate?: string;
  exempt: boolean;
  discontinued: boolean;
  deleted?: boolean;
  index?: number;
  unity?: string;
}

export interface ProductItemResponse {
  _id?: string;
  _brand: BrandItem;
  barcode: string;
  code: string;
  deleted?: boolean;
  description: string;
  discontinued: boolean;
  exempt: boolean;
  healthProgram: string;
  presentations: ProductPresentationsItem[];
  substances: SubstanceItem[];
  symptoms: SymptomItem[];
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
  cost: number;
  wholesale_newPrice?: number; // SIRVE EN EL MODULO DE ACTUALIZAR PRECIOS
  distributor_newPrice?: number;// SIRVE EN EL MODULO DE ACTUALIZAR PRECIOS
  retail_newPrice?: number;// SIRVE EN EL MODULO DE ACTUALIZAR PRECIOS
  cf_newPrice?: number;// SIRVE EN EL MODULO DE ACTUALIZAR PRECIOS
}





export interface ProductAddedItem {
  _product: ProductItem;
  quantity: number;
  stock: number;
}