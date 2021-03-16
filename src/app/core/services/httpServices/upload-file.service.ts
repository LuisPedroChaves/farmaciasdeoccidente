import { Injectable } from '@angular/core';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    public apiConfigService: ApiConfigService
  ) { }

  uploadFile( file: File, type: string, id: string) {

    return new Promise( (resolve, reject ) => {

      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'archivo', file, file.name );

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {

          if (xhr.status === 200) {
            console.log( 'Imagen Subida' );
            resolve( JSON.parse(xhr.response));
          } else {
            console.log( 'Fallo la subida' );
            console.log("🚀 ~ file: upload-file.service.ts ~ line 31 ~ UploadFileService ~ returnnewPromise ~ xhr.response", xhr)
            reject( xhr.response );
          }
        }
      };

      const url = this.apiConfigService.API_UPLOAD + '/' + type + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send( formData );
    });

  }
}
