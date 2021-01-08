import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(n: number ): any {
    const ns = n.toString();
    const splitednumber = ns.match(/.{1,3}/g);
    let generated = '';
    splitednumber.forEach(s => {
        generated += (s + ',');
    });
    return generated;
  }

}
