import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, properties: string[], subfield?: string): any {
    if (!items) { return []; }
    if (items === undefined) { return []; }
    if (!searchText) { return items; }
    if (searchText === undefined) { return items; }
    if (properties === undefined) { return items; }
    if (properties.length <= 0) { return items; }

    if (subfield) {

      searchText = searchText.toLowerCase();
      return items.filter( it => {
        let returnThisItem = false;
        properties.forEach(p => {
            if (it[subfield][p].toLowerCase().includes(searchText)) { returnThisItem = true; }
        });
        if (returnThisItem !== false) { return it; }
      });
    } else {
      searchText = searchText.toLowerCase();
      return items.filter( it => {
        let returnThisItem = false;
        properties.forEach(p => {
            if (it[p].toString().toLowerCase().includes(searchText)) { returnThisItem = true; }
        });
        if (returnThisItem !== false) { return it; }
      });
    }

  }

}
