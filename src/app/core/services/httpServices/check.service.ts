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

export interface CheckPaged {
  checks: CheckItem[];
  total: number;
}

export type CheckStateCounts = Record<string, number>;

@Injectable({
  providedIn: 'root',
})
export class CheckService implements IDataService<CheckItem[]> {
  /**
   * Notificador de cambios. Antes `loadData()` descargaba todos los cheques
   * activos (2k cheques con sus documentos); ahora la página de cheques se
   * pagina por estado en el servidor y `loadData()` solo avisa que recargue.
   */
  private refreshSubject = new Subject<void>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService,
    private printService: PrintService,
    private numberToWords: NumberToWordsPipe
  ) {}

  /* #region  IDataService (compatibilidad) */
  loadData(): void {
    this.refreshSubject.next();
  }

  getData(): void {
    this.refreshSubject.next();
  }

  /** @deprecated Usar `onRefresh()` y `getStatePaged()`. */
  readData(): Observable<CheckItem[]> {
    return new Subject<CheckItem[]>().asObservable();
  }

  setData(): void {}

  invalidateData(): void {}
  /* #endregion */

  /** Se emite cada vez que otro componente crea, actualiza o anula un cheque. */
  onRefresh(): Observable<void> {
    return this.refreshSubject.asObservable();
  }

  /* #region  Listado paginado por estado */
  getStatePaged(state: string, page: number, size: number, search?: string): Observable<CheckPaged> {
    let params = new HttpParams()
      .set('state', state)
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) { params = params.set('search', search); }

    return this.http
      .get(`${this.apiConfigService.API_CHECK}/state/paged`, { params })
      .pipe(map((resp: any) => ({ checks: resp.checks || [], total: resp.total || 0 })));
  }

  getStateCounts(): Observable<CheckStateCounts> {
    return this.http
      .get(`${this.apiConfigService.API_CHECK}/state/counts`)
      .pipe(map((resp: any) => resp.counts || {}));
  }
  /* #endregion */

  getToday(): Observable<any> {
    return this.http
      .get(this.apiConfigService.API_CHECK + '/today')
      .pipe(map((resp: any) => resp.checks));
  }

  getDeliveries(): Observable<any> {
    return this.http.get(this.apiConfigService.API_CHECK + '/deliveries');
  }

  getHistory(startDate, endDate): Observable<any> {
    return this.http
      .get(`${this.apiConfigService.API_CHECK}/history`, {
        params: new HttpParams()
          .set('startDate', startDate.toString())
          .set('endDate', endDate.toString()),
      })
      .pipe(map((resp: any) => resp.checks));
  }

  getReport(startDate, endDate, type: string): Observable<any> {
    return this.http
      .get(`${this.apiConfigService.API_CHECK}/report`, {
        params: new HttpParams()
          .set('startDate', startDate.toString())
          .set('endDate', endDate.toString())
          .set('type', type),
      })
      .pipe(map((resp: any) => resp.checks));
  }

  create(check: CheckItem): Observable<any> {
    check._user = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
    return this.http.post(this.apiConfigService.API_CHECK, check);
  }

  updateState(check: CheckItem): Observable<CheckItem> {
    return this.http
      .put(`${this.apiConfigService.API_CHECK}/state/${check._id}`, check)
      .pipe(map((resp: any) => resp.check));
  }

  print(check: CheckItem) {
    const body = [];

    body.push({ text: '\n' });
    body.push({
      layout: 'noBorders',
      table: {
        widths: [368.504, '*'],
        headerRows: 1,
        body: [
          [
            {
              text: `${check.city}, ${moment(check.date).format(
                'DD [de] MMMM [de] YYYY'
              )}`,
              style: 'text9',
            },
            { text: check.amount.toFixed(2), style: 'text9' },
          ],
          [{ text: '', style: 'text9', colSpan: 2 }],
          [{ text: '', style: 'text9', colSpan: 2 }],
          [{ text: check.name, style: 'text9', colSpan: 2 }],
          [
            {
              text: this.numberToWords.transform(check.amount),
              style: 'text9',
              colSpan: 2,
            },
          ],
        ],
      },
    });

    this.printService.printCheck(body);
  }

  printVoucher(check: CheckItem) {
    const body = [];

    moment.locale('es');
    body.push({
      text: check._bankAccount.no + ' | ' + check._bankAccount.name + '\n',
      style: 'subheader',
    });

    const ArrayToPrint: any[] = [
      [
        { text: 'Cheque No.', style: ['bold', 'graybg'] },
        { text: check.no },
        { text: 'Lugar y Fecha', style: ['bold', 'graybg'] },
        {
          text:
            check.city +
            ', ' +
            moment(check.date).format('DD [de] MMMM [de] YYYY'),
          colSpan: 2,
        },
        {},
      ],
      [
        { text: 'Paguese a:', style: ['bold', 'graybg'] },
        { text: check.name, colSpan: 4 },
        {},
        {},
        {},
      ],
      [
        { text: 'La suma de:', style: ['bold', 'graybg'] },
        { text: this.numberToWords.transform(check.amount), colSpan: 3 },
        {},
        {},
        { text: 'Q. ' + check.amount.toFixed(2) },
      ],
      [
        { text: '', colSpan: 4 },
        {},
        {},
        {},
        { text: 'Firma Autorizada: ', style: ['bold'] },
      ],
    ];
    body.push({
      style: 'cells',
      table: {
        widths: ['auto', '*', 'auto', '*', '*'],
        headerRows: 0,
        heights: ['auto', 'auto', 'auto', 30],
        body: ArrayToPrint,
      },
      // layout: 'noBorders'
    });
    body.push({ text: '\n', style: 'subheader' });

    const ArrayToPrint2: any[] = [
      [
        { text: 'Documentos', style: ['bold', 'graybg'] },
        { text: 'Valor (Q.)', style: ['bold', 'graybg'] },
      ],
    ];

    check.accountsPayables.map((account) => {
      if (
        account.docType !== 'ABONO' &&
        account.docType !== 'CREDITO' &&
        account.docType !== 'CREDITO_TEMP'
      ) {
        ArrayToPrint2.push([
          {
            text: `(FACTURA) ${account.serie} ${account.noBill} - ${moment(
              account.date
            ).format('DD/MMMM/YYYY')}`,
          },
          { text: `+ ${account.total.toFixed(2)}` },
        ]);
      }
      if (account.docType === 'ABONO') {
        ArrayToPrint2.push([
          {
            text: `(NOTA DE ABONO) ${account.serie} ${
              account.noBill
            } - ${moment(account.date).format('DD/MMMM/YYYY')}`,
          },
          { text: `- ${account.total.toFixed(2)}` },
        ]);
      }
      if (account.docType === 'CREDITO' || account.docType === 'CREDITO_TEMP') {
        ArrayToPrint2.push([
          {
            text: `(NOTA DE CRÉDITO) ${account.serie} ${
              account.noBill
            } - ${moment(account.date).format('DD/MMMM/YYYY')}`,
          },
          { text: `- ${account.total.toFixed(2)}` },
        ]);
      }
    });

    check.cashRequisitions.map((cr) => {
      ArrayToPrint2.push([
        { text: `(REQUISICIÓN)` },
        { text: `+ ${cr.total.toFixed(2)}` },
      ]);
    });

    ArrayToPrint2.push([
      { text: 'Total a pagar', style: ['bold', 'graybg'] },
      { text: check.amount.toFixed(2), style: ['bold', 'graybg'] },
    ]);

    body.push({
      style: 'cells',
      table: {
        widths: ['*', 'auto'],
        headerRows: 0,
        body: ArrayToPrint2,
      },
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
