import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timestampDate'
})
export class TimestampDatePipe implements PipeTransform {

  transform(value: any, format: string, lang: string): unknown {
    if (!value) { return; }
    const timestamp = +value;
    const date = new Date(timestamp * 1000);
    moment.locale(lang);
    return moment(date).format(format);
  }

}
