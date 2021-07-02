import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IDataService } from '../config/i-data-service';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { ProductItem } from '../../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements IDataService<ProductItem[]> {

  public productList: ProductItem[];
  productSubject = new Subject<ProductItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({ page }) {
    this.http.get(this.apiConfigService.API_PRODUCT + '?page=' + page + '&size=20').pipe(
      map((response: any) => {
        this.productList = response.products;
        this.productSubject.next(this.productList);
      })).subscribe();
  }

  getData(filter: any) {
    const { page } = filter;
    if (this.productList === undefined) {
      this.loadData({ page });
    } else {
      this.productSubject.next(this.productList);
    }
  }

  readData(): Observable<ProductItem[]> {
    return this.productSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.productList === undefined) {
    } else {
      delete this.productList;
    }
  }

  createProduct(product: ProductItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_PRODUCT, product);
  }

  updateProduct(product: ProductItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_PRODUCT}/${product._id}`, product);
  }

  deleteProduct(product: ProductItem): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_PRODUCT}/${product._id}`);
  }

}
