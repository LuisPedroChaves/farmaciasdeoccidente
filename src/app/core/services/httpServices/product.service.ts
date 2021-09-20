import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from '../config/api-config.service';
import { ProductItem } from '../../models/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  TOTAL_PRODUCTS = 0;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData(
    pageNumber: number = 1,
    pageSize: number = 20,
    search: string = ''
  ): Observable<ProductItem[]> {
    return this.http
      .get(this.apiConfigService.API_PRODUCT, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('search', search.toString()),
      })
      .pipe(
        map((response: any) => {
          this.TOTAL_PRODUCTS = response.TOTAL;
          return response.products;
        })
      );
  }

  createProduct(product: ProductItem): Observable<any> {
    console.log('Sending POST request');
    return this.http.post(this.apiConfigService.API_PRODUCT, product);
  }

  updateProduct(product: ProductItem): Observable<any> {
    console.log(product);

    return this.http.put(
      `${this.apiConfigService.API_PRODUCT}/${product._id}`,
      product
    );
  }

  deleteProduct(product: ProductItem): Observable<any> {
    return this.http.delete(
      `${this.apiConfigService.API_PRODUCT}/${product._id}`
    );
  }

  search(search: string = ''): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PRODUCT}/search`, {
      params: new HttpParams().set('search', search.toString()),
    });
  }

  findById(id: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PRODUCT}`, {
      params: new HttpParams().set('_id', id.toString()),
    });
  }
}
