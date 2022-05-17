import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CashItem } from '../../models/Cash';
import { IDataService } from '../config/i-data-service';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class CashService implements IDataService<CashItem[]> {

  public cashList: CashItem[];
  cashSubject = new Subject<CashItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(`${this.apiConfigService.API_CASH}`)
      .pipe(
        map((response: any) => {

          this.cashList = response.cash;
          this.cashSubject.next(this.cashList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.cashList === undefined) {
      this.loadData();
    } else {
      this.cashSubject.next(this.cashList);
    }
  }

  readData(): Observable<CashItem[]> {
    return this.cashSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.cashList === undefined) {
    } else {
      delete this.cashList;
    }
  }

  getUser(type: string): Observable<CashItem> {
    return this.http.get(`${this.apiConfigService.API_CASH}/user`, {
      params: new HttpParams()
        .set('type', type.toString())
    }).pipe(
      map((resp: any) => resp.cash)
    )
  }

  create(cash: CashItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_CASH, cash);
  }

  update(cash: CashItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_CASH + '/' + cash._id, cash);
  }

  delete(cash: CashItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_CASH + '/' + cash._id, {
      params: new HttpParams()
      .set('details', details.toString())
    });
  }
}
