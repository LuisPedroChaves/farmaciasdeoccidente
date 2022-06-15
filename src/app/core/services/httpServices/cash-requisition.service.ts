import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CashRequisitionItem } from '../../models/CashRequisition';
import { ApiConfigService } from '../config/api-config.service';
import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class CashRequisitionService {

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  readAll(): Observable<CashRequisitionItem[]> {
    return this.http.get(this.apiConfigService.API_CASH_REQUISITION)
      .pipe(
        map((resp: any) => resp.cashRequisitions)
      )
  }

  readHistory(startDate, endDate): Observable<CashRequisitionItem[]> {
    return this.http.get(`${this.apiConfigService.API_CASH_REQUISITION}/history`, {
      params: new HttpParams()
      .set('startDate', startDate.toString())
      .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.cashRequisitions)
      );
  }

  create(cashRequisition: CashRequisitionItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_CASH_REQUISITION, cashRequisition);
  }

  update(cashRequisition: CashRequisitionItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_CASH_REQUISITION + '/' + cashRequisition._id, cashRequisition);
  }

  delete(cashRequisition: CashRequisitionItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_CASH_REQUISITION + '/' + cashRequisition._id, {
      params: new HttpParams()
        .set('details', details.toString())
    });
  }
}
