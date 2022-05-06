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

  uploadFile(file: File) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('archivo', file, file.name);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            console.log('Archivo Subido');
            resolve(JSON.parse(xhr.response));
          } else {
            console.log('Fallo la subida');
            reject(xhr.response);
          }
        }
      };

      const url = this.apiConfigService.API_PRODUCT + '/xlsx';

      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  }

  createProduct(product: ProductItem): Observable<any> {
    console.log('Sending POST request');
    return this.http.post(this.apiConfigService.API_PRODUCT, product);
  }

  update(product: any): Observable<any> {
    return this.http.put(
      `${this.apiConfigService.API_PRODUCT}/`,
      product
    );
  }

  updateProduct(product: ProductItem): Observable<any> {
    console.log(product);

    return this.http.put(
      `${this.apiConfigService.API_PRODUCT}/${product._id}`,
      product
    );
  }

  updatePrices(product: ProductItem): Observable<any> {

    return this.http.put(
      `${this.apiConfigService.API_PRODUCT}/prices/${product._id}`,
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

  searchCheckStock(search: string = '', field = 'barcode'): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PRODUCT}/searchCheckStock`, {
      params: new HttpParams()
      .set('search', search.toString())
      .set('field', field.toString())
    });
  }

  searchByIndex(search: string = ''): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PRODUCT}/searchByIndex`, {
      params: new HttpParams().set('search', search.toString()),
    });
  }

  findById(id: string): Observable<any> {
    console.log(id);
    return this.http.get(`${this.apiConfigService.API_PRODUCT}/${id}`);
  }

  discontinued(product: ProductItem): Observable<any> {
    return this.http.delete(
      `${this.apiConfigService.API_PRODUCT}/discontinued/${product._id}`
    );
  }
}
