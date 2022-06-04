import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankFlowItem } from '../../models/Bank';
import { ApiConfigService } from '../config/api-config.service';

import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class BankFlowService implements IDataService<BankFlowItem[]> {

  public bankFlowList: BankFlowItem[];
  bankFlowSubject = new Subject<BankFlowItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({ idBankAccount, startDate, endDate }): void {
    this.http
      .get(`${this.apiConfigService.API_BANK_FLOW}/${idBankAccount}`, {
        params: new HttpParams()
          .set('startDate', startDate.toString())
          .set('endDate', endDate.toString())
      })
      .pipe(
        map((response: any) => {

          this.bankFlowList = response.bankFlows;
          this.bankFlowSubject.next(this.bankFlowList);
        })
      )
      .subscribe();
  }

  getData({ startDate, endDate, idBankAccount }): void {
    if (this.bankFlowList === undefined) {
      this.loadData({ idBankAccount, startDate, endDate });
    } else {
      this.bankFlowSubject.next(this.bankFlowList);
    }
  }

  readData(): Observable<BankFlowItem[]> {
    return this.bankFlowSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.bankFlowList === undefined) {
    } else {
      delete this.bankFlowList;
    }
  }

  create(bankFlow: BankFlowItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_BANK_FLOW, bankFlow)
  }
}
