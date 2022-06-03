import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  style = {
    header: { fontSize: 16, bold: true },
    bold: { bold: true },
    subheader: { fontSize: 12, },
    text7: { fontSize: 7 },
    text8: { fontSize: 8 },
    text9: { fontSize: 9 },
    text10: { fontSize: 10 },
    text11: { fontSize: 11 },
    text12: { fontSize: 12 },
    muted: { color: "gray" },
    boldtext: { bold: true },
    right: { alignment: 'right' },
    center: { alignment: 'center' },
    cellHeader: { fontSize: 8, fillColor: '#D6D6D6', bold: true },
    cellMetrics: { fontSize: 8, bold: true, marginButton: '10px' },
    cells: { fontSize: 8 }
  };

  constructor() { }

  printCheck(body: any) {
    const printpage = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      pageMargins: [119.055, 51.0236, 0, 0],
      content: [],
      styles: this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).print();
    }, 500);
  }

  print(body: any) {
    const printpage = {
      pageSize: 'A6',
      pageOrientation: 'portrait',
      pageMargins: [20, 20, 20, 35],
      content: [],
      styles: this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).print();
    }, 500);
  }

  printPortrait(body: any) {
    const printpage = {
      pageOrientation: 'portrait',
      pageMargins: [ 40, 40, 40, 70 ],
      content: [],
      styles:  this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).print();
    }, 500);
  }

  printLandscape(body: any) {
    const printpage = {
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      content: [],
      styles: this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).print();
    }, 500);
  }

  downloadPDF(body: any, name: string) {
    const printpage = {
      pageOrientation: 'portrait',
      pageMargins: [15, 15, 15, 15],
      content: [],
      styles: this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).download(name);
    }, 500);
  }

  downloadPDFLandscape(body: any, name: string) {
    const printpage = {
      pageOrientation: 'landscape',
      pageMargins: [15, 15, 15, 15],
      content: [],
      styles: this.style
    };
    printpage.content = body;
    setTimeout(t => {
      pdfMake.createPdf(printpage).download(name);
    }, 500);
  }


  generateColumns(names: string[]): any[] {
    const columns: any = [];
    names.forEach(n => {
      columns.push({ text: n, style: 'cellHeader' });
    });
    return columns;
  }
}
