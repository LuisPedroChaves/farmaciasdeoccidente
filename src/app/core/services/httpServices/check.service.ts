import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { IDataService } from '../config/i-data-service';
import { CheckItem } from '../../models/Check';
import { ApiConfigService } from '../config/api-config.service';
import { PrintService } from '../internal/print.service';
import { NumberToWordsPipe } from '../../shared/pipes/formatPipes/number-to-words.pipe';

@Injectable({
  providedIn: 'root'
})
export class CheckService implements IDataService<CheckItem[]> {

  public checkList: CheckItem[];
  checkSubject = new Subject<CheckItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService,
    private printService: PrintService,
    private numberToWords: NumberToWordsPipe,
  ) { }

  loadData(): void {
    this.http
      .get(`${this.apiConfigService.API_CHECK}/state`)
      .pipe(
        map((response: any) => {

          this.checkList = response.checks;
          this.checkSubject.next(this.checkList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.checkList === undefined) {
      this.loadData();
    } else {
      this.checkSubject.next(this.checkList);
    }
  }

  readData(): Observable<CheckItem[]> {
    return this.checkSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.checkList === undefined) {
    } else {
      delete this.checkList;
    }
  }

  getToday(): Observable<any> {
    return this.http.get(this.apiConfigService.API_CHECK + '/today')
      .pipe(
        map((resp: any) => resp.checks)
      )
  }

  getDeliveries(): Observable<any> {
    return this.http.get(this.apiConfigService.API_CHECK + '/deliveries');
  }

  getHistory(startDate, endDate): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_CHECK}/history`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.checks)
      );
  }

  create(check: CheckItem): Observable<any> {
    check._user = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
    return this.http.post(this.apiConfigService.API_CHECK, check);
  }

  updateState(check: CheckItem): Observable<CheckItem> {
    return this.http.put(`${this.apiConfigService.API_CHECK}/state/${check._id}`, check)
      .pipe(
        map((resp: any) => resp.check)
      )
  }

  print(check: CheckItem) {
    const body = [];

    body.push({ text: '\n' });
    body.push(
      {
        layout: 'noBorders',
        table: {
          widths: [368.504, '*'],
          headerRows: 1,
          body: [
            [{ text: `${check.city}, ${moment(check.date).format('DD [de] MMMM [de] YYYY')}`, style: 'text9' }, { text: check.amount.toFixed(2), style: 'text9' }],
            [{ text: '', style: 'text9', colSpan: 2 }],
            [{ text: '', style: 'text9', colSpan: 2 }],
            [{ text: check.name, style: 'text9', colSpan: 2 }],
            [{ text: this.numberToWords.transform(check.amount), style: 'text9', colSpan: 2 }],
          ]
        }
      });

    this.printService.printCheck(body);
  }

  printVoucher(check: CheckItem) {
    console.log("🚀 ~ file: check.service.ts ~ line 121 ~ CheckService ~ printVoucher ~ check", check)
    const body = [];

    moment.locale('es');
    body.push({ text: check._bankAccount.no + ' | ' + check._bankAccount.name + '\n', style: 'subheader' });

    const ArrayToPrint: any[] = [
      [{ text: 'Cheque No.', style: ['bold', 'graybg'] }, { text: check.no }, { text: 'Lugar y Fecha', style: ['bold', 'graybg'] }, { text: check.city + ', ' + moment(check.date).format('DD [de] MMMM [de] YYYY'), colSpan: 2 }, {}],
      [{ text: 'Paguese a:', style: ['bold', 'graybg'] }, { text: check.name, colSpan: 4 }, {}, {}, {}],
      [{ text: 'La suma de:', style: ['bold', 'graybg'] }, { text: this.numberToWords.transform(check.amount), colSpan: 3 }, {}, {}, { text: 'Q. ' + check.amount.toFixed(2) }],
      [{ text: '', colSpan: 4 }, {}, {}, {}, { text: 'Firma Autorizada: ', style: ['bold'] }],
    ];
    body.push({
      style: 'cells',
      table: {
        widths: ['auto', '*', 'auto', '*', '*'],
        headerRows: 0,
        heights: ['auto', 'auto', 'auto', 30],
        body: ArrayToPrint
      },
      // layout: 'noBorders'
    });
    body.push({ text: '\n', style: 'subheader' });

    const ArrayToPrint2: any[] = [
      [{ text: 'Documentos', style: ['bold', 'graybg'] }, { text: 'Valor (Q.)', style: ['bold', 'graybg'] }],
    ];

    check.accountsPayables.map(account => {
      if (account.docType !== 'ABONO' && account.docType !== 'CREDITO' && account.docType !== 'CREDITO_TEMP') {
        ArrayToPrint2.push([{ text: `${account.serie} ${account.noBill} (FACTURA)` }, { text: `+ ${account.total.toFixed(2)}` }])
      }
      if (account.docType === 'ABONO') {
        ArrayToPrint2.push([{ text: `${account.serie} ${account.noBill} (NOTA DE ABONO)` }, { text: `- ${account.total.toFixed(2)}` }])
      }
      if (account.docType === 'CREDITO' || account.docType === 'CREDITO_TEMP') {
        ArrayToPrint2.push([{ text: `${account.serie} ${account.noBill} (NOTA DE CREDITO)` }, { text: `- ${account.total.toFixed(2)}` }])
      }
    })

    // check.cashRequisitions.map(cr => {
    //   ArrayToPrint2.push([{ text: `${cr.} (FACTURA)` }, { text: `+ ${account.total.toFixed(2)}` }])
    // })

    ArrayToPrint2.push([{ text: 'Total a pagar' }, { text: check.amount.toFixed(2) }])

    body.push({
      style: 'cells',
      table: {
        widths: ['*', 'auto'],
        // heights: ['auto', 50, 'auto'],
        headerRows: 0,
        body: ArrayToPrint2
      }
    });


    // const ArrayToPrint3: any[] = [
    //   [{ text: 'Hecho Por', style: ['bold', 'graybg'] }, { text: 'Autorizado Por', style: ['bold', 'graybg'] }, { text: 'Recibí Conforme', style: ['bold', 'graybg'] }],
    //   [{ text: 'JCLL' }, { text: 'JMM' }, {}],
    // ];
    // body.push({
    //   style: 'cells',
    //   table: {
    //     widths: ['*', '*', '*'],
    //     heights: ['auto', 30],
    //     headerRows: 0,
    //     body: ArrayToPrint3
    //   }
    // });

    this.printService.printPortrait(body);
  }
}
