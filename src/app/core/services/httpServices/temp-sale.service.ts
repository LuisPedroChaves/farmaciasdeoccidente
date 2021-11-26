import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiConfigService } from 'src/app/core/services/config/api-config.service';
import { TempSaleItem } from '../../models/TempSale';

@Injectable({
  providedIn: 'root'
})
export class TempSaleService {

  constructor(
    public apiConfigService: ApiConfigService,
    private http: HttpClient,
  ) { }

  getStatics( _cellar, _brand, startDate, endDate ): Observable<any> {
    return this.http.get(this.apiConfigService.API_TEMP_SALE + '/', {
      params: new HttpParams()
        .set('_cellar', _cellar.toString())
        .set('_brand', _brand.toString())
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    });
  }

  uploadFile(file: File, tempSale: any) {
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

      formData.append('_cellar', tempSale._cellar);
      formData.append('date', tempSale.date);

      const url = this.apiConfigService.API_TEMP_SALE + '/xlsx';

      xhr.open('POST', url, true);
      xhr.send( formData );
    });
  }
}
