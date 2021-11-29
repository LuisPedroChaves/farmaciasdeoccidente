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

  uploadFile(file: File, _cellar: string) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'archivo', file, file.name );

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            console.log( 'Archivo Subido' );
            resolve( JSON.parse(xhr.response));
          } else {
            console.log( 'Fallo la subida' );
            console.log("🚀 ~ file: upload-file.service.ts ~ line 31 ~ UploadFileService ~ returnnewPromise ~ xhr.response", xhr)
            reject( xhr.response );
          }
        }
      };

      const url = this.apiConfigService.API_TEMP_STORAGE + '/xlsx/' + _cellar;

      xhr.open('POST', url, true);
      xhr.send( formData );
    });
  }
}
