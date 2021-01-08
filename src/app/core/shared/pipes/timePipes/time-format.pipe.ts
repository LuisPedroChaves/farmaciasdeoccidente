import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(date: string, format: string, lang: string ): string {
    const datec = date;
    moment.locale(lang);
    return moment(datec).format(format);
  }

}
