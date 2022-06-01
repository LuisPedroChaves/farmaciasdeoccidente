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
export class CashRequisitionService implements IDataService<CashRequisitionItem[]> {

  public cashRequisitionList: CashRequisitionItem[];
  cashRequisitionSubject = new Subject<CashRequisitionItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(`${this.apiConfigService.API_CASH_REQUISITION}/`)
      .pipe(
        map((response: any) => {

          this.cashRequisitionList = response.accountsPayables;
          this.cashRequisitionSubject.next(this.cashRequisitionList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.cashRequisitionList === undefined) {
      this.loadData();
    } else {
      this.cashRequisitionSubject.next(this.cashRequisitionList);
    }
  }

  readData(): Observable<CashRequisitionItem[]> {
    return this.cashRequisitionSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.cashRequisitionList === undefined) {
    } else {
      delete this.cashRequisitionList;
    }
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
