import { BrandItem } from "./Brand";
import { CellarItem } from "./Cellar";

export interface ProductItem {
    _id: string;
    _brand: BrandItem,
    code: string,
    description: string,
    wholesale_price: number,
    distributor_price: number,
    retail_price: number,
    cf_price: number,
    missing: ProductMissingItem[],
    stagnant: ProductStagnantItem[],
}

export interface ProductMissingItem {
    _cellar: CellarItem,
    quantity: number,
    state: string,
}

export interface ProductStagnantItem {
    _cellar: CellarItem,
    detail: ProductStagnantDetailItem[]
}

export interface ProductStagnantDetailItem {
    quantity: number,
    expiration_date: Date
}