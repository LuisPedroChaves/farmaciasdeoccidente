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

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }


  loadData(
    pageNumber = 1, pageSize = 20): Observable<ProductItem[]> {

    return this.http
      .get(this.apiConfigService.API_PRODUCT, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
      })
      .pipe(
        map((response: any) => response.products)
      )
  }

  createProduct(product: ProductItem): Observable<any> {
    console.log('Sending POST request');
    return this.http.post(this.apiConfigService.API_PRODUCT, product);
  }

  updateProduct(product: ProductItem): Observable<any> {
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
}
