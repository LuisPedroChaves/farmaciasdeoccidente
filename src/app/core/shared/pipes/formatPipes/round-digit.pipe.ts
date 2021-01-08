import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundDigit'
})
export class RoundDigitPipe implements PipeTransform {

  transform(n: any, digits: number ): any {
    return parseFloat(n).toFixed(digits);
  }

}
