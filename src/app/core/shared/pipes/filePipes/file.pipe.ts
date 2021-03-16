import { Pipe, PipeTransform } from '@angular/core';
import { ApiConfigService } from 'src/app/core/services/config/api-config.service';

@Pipe({
  name: 'file'
})
export class FilePipe implements PipeTransform {

  constructor(
    public apiConfigService: ApiConfigService
  ) { }

  transform(archivo: string, type: string = 'saleBalances'): any {
    let url = this.apiConfigService.API_READ;

    if (!archivo) {
      return false;
    }

    switch (type) {
      case 'saleBalances':
        url += '/saleBalances/' + archivo;
        break;

      default:
        url = null;
        break;
    }

    return url;
  }

}
