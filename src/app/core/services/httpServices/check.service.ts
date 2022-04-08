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
  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

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

  setData(): void {}

  invalidateData(): void {
    if (this.checkList === undefined) {
    } else {
      delete this.checkList;
    }
  }

  getToday(): Observable<any> {
    return this.http.get(this.apiConfigService.API_CHECK + '/today');
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
    check._user = this.userID;
    return this.http.post(this.apiConfigService.API_CHECK, check);
  }

  updateState(check: CheckItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_CHECK}/state/${check._id}`, check);
  }

  print(check: CheckItem) {
    const body = [];

    body.push({ text: '\n' });
    body.push(
      {
        layout: 'noBorders',
        table: {
          widths: ['50%', '10%'],
          headerRows: 1,
          body: [
            [{ text: `${check.city}, ${moment(check.date).format('DD [de] MMMM [de] YYYY')}`, style: 'text9' }, { text: check.amount.toFixed(2), style: 'text9' }],
            [{ text: check.name, style: 'text9', colSpan: 2 }],
            [{ text: this.numberToWords.transform(check.amount), style: 'text9', colSpan: 2 }],
          ]
        }
      });

    this.printService.print(body);
  }
}
