import { Injectable } from '@angular/core';
import { PayrollDetailItem, PayrollItem } from 'src/app/core/models/Payroll';
import { PrintService } from 'src/app/core/services/internal/print.service';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
@Injectable({
  providedIn: 'root'
})
export class PayrollPrintService {

  constructor(private _decimalPipe: DecimalPipe) { }


  printMonthlyPayroll(p: PayrollItem): Promise<any> {
    const body = [];
    console.log(p);
    return new Promise((resolve) => {
      body.push({text: 'Tel Grupo de Negocios, S.A.' + '\n', style: 'header'});
      body.push({text: 'Planilla Mensual' + '\n', style: 'subheader'});
      body.push({text: 'Fecha de Creación:' + moment(p.date).format('DD/MM/YYYYY') + '\n', style: 'subheader'});
      const ArrayToPrint: any[] = [];

      const printColumns: any[] = [
        { text: 'Código', style: 'cellHeader' },
        { text: 'Nombre', style: 'cellHeader' },
        { text: 'Puesto', style: 'cellHeader' },
        { text: 'Sub Total', style: 'cellHeader' },
        { text: 'Bonificaciones', style: 'cellHeader' },
        { text: 'IGSS', style: 'cellHeader' },
        { text: 'Descuentos', style: 'cellHeader' },
        { text: 'Total', style: 'cellHeader' },
    ];

    ArrayToPrint.push(printColumns);
    const rowArray: any[] = [];

    p.details.forEach(e => {
      const row: any[] = [
        (e._employeeJob as any)._employee.code,
        (e._employeeJob as any)._employee.name + ' ' + (e._employeeJob as any)._employee.lastName,
        (e._employeeJob as any)._job.name || '',
        `Q. ${ this._decimalPipe.transform((e._employeeJob as any).initialSalary, '.2') }`,
        `Q. ${ this._decimalPipe.transform((e.extraHours + e.holiday +  e.incentiveBonus + e.jobBonus + e.otherBonus ), '.2') }`,
        `Q. ${ this._decimalPipe.transform((e.igss), '.2') }`,
        `Q. ${ this._decimalPipe.transform((e.productCharges + e.credits + e.foults), '.2') }`,
        `Q. ${ this._decimalPipe.transform((((e._employeeJob as any).initialSalary) + (e.extraHours + e.holiday + e.incentiveBonus + e.jobBonus + e.otherBonus) - (e.igss) - (e.productCharges + e.credits + e.foults)), '.2') }`,
      ];
      rowArray.push(row);
    });

    rowArray.forEach(row => {
      ArrayToPrint.push(row);
    });
    
    body.push({
      style: 'cells',
      table: {
          widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
          headerRows: 1,
          body: ArrayToPrint
      }
    });
    
    
    
    
    
    
    
      resolve(body)
    });
  }

  printReceipts(p: PayrollItem) {
    const body = [];
    return new Promise(async (resolve) => {
      const image = await this.getBase64ImageFromUrl('assets/images/logotel.jpg');
      const ArrayToPrint: any[] = [];

      p.details.forEach(e => {
        const receipt = this.makeReceipt(e, image, p);
        const receipt2 = this.makeReceipt(e, image, p);
        body.push({...receipt});
        body.push({...receipt2});
        body.push({text: '', pageBreak: 'before'});

      });

      resolve(body);
    });
  }



  makeReceipt(p: PayrollDetailItem, image, payroll: PayrollItem) {
    const raisings = (p._employeeJob as any).initialSalary + (p.extraHours + p.holiday + p.incentiveBonus + p.jobBonus + p.otherBonus );
    const discounts = (p.productCharges + p.credits + p.foults) + p.igss;
    return {
      style: 'cells',
      table: {
        widths: [100, '*', '*', '*'],
        headerRows: 1,
        heights: [
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',

          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          'auto',
          50,
          'auto',
          'auto',
          50,
        ],
        
        // keepWithHeaderRows: 1,
        body: [
          [{}, {}, {}, {}],
          [{rowSpan: 7, width: 100, image: image}, { text: 'Recibos de pago', colSpan: 3, style: ['bold', 'center'] }, {}, {}],
          [{}, {}, {}, {}],
          ['', {text: 'Pago corresponiente al mes de:', colSpan: 2}, {}, moment(payroll.date).format('MMMM')],
          [{}, {}, {}, {}],
          ['', {}, 'Código de empleado:', ((p._employeeJob as EmployeeJobItem)._employee as any).code],
          ['', {}, 'Nombre del Empleado:', ((p._employeeJob as EmployeeJobItem)._employee as any).name + ' ' + ((p._employeeJob as EmployeeJobItem)._employee as any).lastName],
          [{}, {}, {}, {}],

          [{text: 'Sueldo Base:' , style: 'bold'},          `Q. ${ this._decimalPipe.transform((p._employeeJob as any).initialSalary, '.2') }`,           {text: 'IGSS:' , style: 'bold'},        `Q. ${ this._decimalPipe.transform((p.igss), '.2') }`],
          [{text: 'Asuetos y 7mo día:' , style: 'bold'},    `Q. ${ this._decimalPipe.transform(p.holiday, '.2') }`,                                               {text: 'Descuentos:' , style: 'bold'},  `Q. ${ this._decimalPipe.transform((p.productCharges + p.credits + p.foults), '.2') }`],
          [{text: 'Horas Extras:' , style: 'bold'},         `Q. ${ this._decimalPipe.transform(p.extraHours, '.2') }`,                                               '',  ''],
          [{text: 'Bonificaciones:' , style: 'bold'},       `Q. ${ this._decimalPipe.transform((p.incentiveBonus + p.jobBonus + p.otherBonus ), '.2') }`,                                         '',  ''],
          [{text: 'Total:' , style: 'bold'},                `Q. ${ this._decimalPipe.transform(raisings, '.2') }`,                                        {text: 'Total:' , style: 'bold'},       `Q. ${ this._decimalPipe.transform(discounts, '.2') }`],
          ['', '', {text: 'Total a recibir:' , style: 'bold'},       `Q. ${ this._decimalPipe.transform(raisings - discounts, '.2') }`],
          ['', '', '', ''],
          [{text: '___________________________________', colSpan: 2, style: ['center']}, {}, {text: '___________________________________', colSpan: 2, style: ['center']}, {},],
          [{text: 'Nombre de quien recibe', colSpan: 2, style: ['center']}, {}, {text: 'Firma', colSpan: 2, style: ['center']}, {},],
          ['', '', '', ''],

        ],
      },
      layout: 'noBorders',
    };

  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  printIGSS(p: PayrollItem) {
    const body = [];
    return new Promise((resolve) => {
      body.push({text: 'Tel Grupo de Negocios, S.A.' + '\n', style: 'header'});
      body.push({text: 'Planilla del IGSS' + '\n', style: 'subheader'});
      body.push({text: 'Fecha de Creación:' + moment(p.date).format('DD/MM/YYYYY') + '\n', style: 'subheader'});
      const ArrayToPrint: any[] = [];

      const printColumns: any[] = [
        { text: 'Código', style: 'cellHeader' },
        { text: 'Nombre', style: 'cellHeader' },
        { text: 'Puesto', style: 'cellHeader' },
        { text: 'Nit', style: 'cellHeader' },
        { text: 'Afiliación', style: 'cellHeader' },
        { text: 'Sub Total', style: 'cellHeader' },
        { text: 'Cálculo 4.83%', style: 'cellHeader' },
    ];

    ArrayToPrint.push(printColumns);
    const rowArray: any[] = [];

    p.details.forEach(e => {
      const row: any[] = [
        (e._employeeJob as any)._employee.code,
        (e._employeeJob as any)._employee.name + ' ' + (e._employeeJob as any)._employee.lastName,
        (e._employeeJob as any)._job.name,
        (e._employeeJob as any)._employee.nit,
        (e._employeeJob as any)._employee.igssNumber || '',
        `Q. ${ this._decimalPipe.transform((e._employeeJob as any).initialSalary, '.2') }`,
        `Q. ${ this._decimalPipe.transform(e.igss, '.2') }`,
    
      ];
      rowArray.push(row);
    });

    rowArray.forEach(row => {
      ArrayToPrint.push(row);
    });
    
    body.push({
      style: 'cells',
      table: {
          widths: ['auto', '*', '*', 'auto', 'auto', 'auto', 'auto'],
          headerRows: 1,
          body: ArrayToPrint
      }
    });
    
    
    
    
    
    
    
      resolve(body)
    });
  }
}
