import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from 'src/app/core/services/config/api-config.service';
import { TempStorageItem } from '../../models/TempStorage';

@Injectable({
  providedIn: 'root'
})
export class TempStorageService {
  TOTAL_STORAGES = 0;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(
    _cellar,
    pageNumber: number = 1,
    pageSize: number = 20,
    search: string = '',
    brand: string = ''
  ): Observable<TempStorageItem[]> {
    return this.http
      .get(`${this.apiConfigService.API_TEMP_STORAGE}/${_cellar}`, {
        params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('size', pageSize.toString())
          .set('search', search.toString())
          .set('brand', brand.toString())
      })
      .pipe(
        map((response: any) => {
          this.TOTAL_STORAGES = response.TOTAL;
          return response.tempStorages;
        })
      );
  }

  loadStockConsolidated(
    _brand
  ): Observable<TempStorageItem[]> {
    return this.http
      .get(`${this.apiConfigService.API_TEMP_STORAGE}/stockConsolidated`, {
        params: new HttpParams()
          .set('_brand', _brand.toString())
      })
      .pipe(
        map((response: any) => {
          return response.tempStorages;
        })
      );
  }

  searchByProduct(_product: string, _cellar: string): Observable<TempStorageItem[]> {
    return this.http.get(`${this.apiConfigService.API_TEMP_STORAGE}/checkStock/${_cellar}`, {
      params: new HttpParams()
        .set('_product', _product.toString())
    })
      .pipe(
        map((resp: any) => {
          return resp.storages;
        })
      )
  }

  uploadFile(file: File, _cellar: string) {
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

      const url = this.apiConfigService.API_TEMP_STORAGE + '/xlsx/' + _cellar;

      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  }

  update(body: any[]): Observable<any> {
    return this.http.put(this.apiConfigService.API_TEMP_STORAGE + '/', body);
  }

  updateGlobal(body: any): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_TEMP_STORAGE}/global`, body);
  }

  stockReset(_cellar: string): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_TEMP_STORAGE}/stockReset/${_cellar}`, null);
  }
}
