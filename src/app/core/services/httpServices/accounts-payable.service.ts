import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { AccountsPayableItem } from '../../models/AccountsPayable';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsPayableService implements IDataService<AccountsPayableItem[]> {

  public accountsPayableList: AccountsPayableItem[];
  accountsPayableSubject = new Subject<AccountsPayableItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/unpaids`)
      .pipe(
        map((response: any) => {

          this.accountsPayableList = response.accountsPayables;
          this.accountsPayableSubject.next(this.accountsPayableList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.accountsPayableList === undefined) {
      this.loadData();
    } else {
      this.accountsPayableSubject.next(this.accountsPayableList);
    }
  }

  readData(): Observable<AccountsPayableItem[]> {
    return this.accountsPayableSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.accountsPayableList === undefined) {
    } else {
      delete this.accountsPayableList;
    }
  }

  getReportExpenses(startDate, endDate): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/expenses`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getReportProvider(startDate, endDate, _provider: string = null): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/report/${_provider}`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getHistory(startDate, endDate, _provider: string = null): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/history/${_provider}`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getTempCredits(): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/tempCredits`)
      .pipe(
        map((resp: any) => resp.accountsPayables)
      )
  }

  create(accountPayable: AccountsPayableItem): Observable<any> {
    accountPayable._user = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
    return this.http.post(this.apiConfigService.API_ACCOUNTS_PAYABLE, accountPayable);
  }

  update(accountPayable: AccountsPayableItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_ACCOUNTS_PAYABLE + '/' + accountPayable._id, accountPayable);
  }

  delete(accountPayable: AccountsPayableItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_ACCOUNTS_PAYABLE + '/' + accountPayable._id, {
      params: new HttpParams()
        .set('details', details.toString())
    });
  }
}
