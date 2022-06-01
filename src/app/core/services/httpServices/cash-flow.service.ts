import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CashItem } from '../../models/Cash';
import { CashFlowItem } from '../../models/CashFlow';
import { ApiConfigService } from '../config/api-config.service';
import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService implements IDataService<CashFlowItem[]> {

  public cashFlowList: CashFlowItem[];
  cashFlowSubject = new Subject<CashFlowItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(idCash: string): void {
    this.http
      .get(`${this.apiConfigService.API_CASH_FLOW}/today/${idCash}`)
      .pipe(
        map((response: any) => {

          this.cashFlowList = response.cashFlow;
          this.cashFlowSubject.next(this.cashFlowList);
        })
      )
      .subscribe();
  }

  getData(idCash: string): void {
    if (this.cashFlowList === undefined) {
      this.loadData(idCash);
    } else {
      this.cashFlowSubject.next(this.cashFlowList);
    }
  }

  readData(): Observable<CashFlowItem[]> {
    return this.cashFlowSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.cashFlowList === undefined) {
    } else {
      delete this.cashFlowList;
    }
  }

  readCash(idCash: string, state: string): Observable<CashFlowItem[]> {
    return this.http.get(`${this.apiConfigService.API_CASH_FLOW}/${idCash}`, {
      params: new HttpParams()
        .set('state', state)
    })
      .pipe(
        map((resp: any) => resp.cashFlows)
      )
  }

  getHistory(startDate, endDate, idCash: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_CASH_FLOW}/history/${idCash}`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.cashFlow)
      );
  }

  create(cashFlow: CashFlowItem): Observable<CashFlowItem> {
    return this.http.post(this.apiConfigService.API_CASH_FLOW, cashFlow)
      .pipe(
        map((resp: any) => resp.cashFlow)
      )
  }

  update(cashFlow: CashFlowItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_CASH_FLOW}/${cashFlow._id}`, cashFlow);
  }

  delete(cashFlow: CashFlowItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_CASH_FLOW + '/' + cashFlow._id);
  }
}
