import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class XlsxService {
  constructor() {}

  downloadManyPages(pages: any[], names: string[], docname: string): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    pages.forEach((p, index) => {
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(p);

      const name = names[index].substring(0, 28);
      const finalName = name.replace(/[^0-9a-zA-Z, ,-]/g, '');
      XLSX.utils.book_append_sheet(wb, ws, finalName);
    });

    XLSX.writeFile(wb, docname + '.xlsx');
  }

  downloadSinglePage(page: any[], name: string, docname: string): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(page);

    const namepage = name.substring(0, 28);
    const finalName = name.replace(/[^0-9a-zA-Z, ,-]/g, '');
    XLSX.utils.book_append_sheet(wb, ws, finalName);

    XLSX.writeFile(wb, docname + '.xlsx');
  }
}
