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

    const SWITCH_TYPES = {
      'saleBalances': `${url}/saleBalances/${archivo}`,
      'internalOrders': `${url}/internalOrders/${archivo}`,
      'internalOrdersDispatch': `${url}/internalOrdersDispatch/${archivo}`,
    };

    return SWITCH_TYPES[type]
    ? SWITCH_TYPES[type]
    : null;
  }

}
