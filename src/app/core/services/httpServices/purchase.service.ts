import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from '../config/api-config.service';
import { PurchaseItem } from '../../models/Purchase';
import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService implements IDataService<PurchaseItem[]> {

  public purchaseList: PurchaseItem[];
  purchaseSubject = new Subject<PurchaseItem[]>();

  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    private http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({ month, year, _cellar }) {
    this.http.get(this.apiConfigService.API_PURCHASE + '/' + _cellar + '?month=' + month + '&year=' + year).pipe(
      map((response: any) => {
        this.purchaseList = response.purchases;
        this.purchaseSubject.next(this.purchaseList);
      })).subscribe();
  }

  getData(filter: any) {
    const { month, year, _cellar } = filter;
    if (this.purchaseList === undefined) {
      this.loadData({ month, year, _cellar });
    } else {
      this.purchaseSubject.next(this.purchaseList);
    }
  }

  readData(): Observable<PurchaseItem[]> {
    return this.purchaseSubject.asObservable();
  }

  setData() { }

  invalidateData() {
    if (this.purchaseList === undefined) {
    } else {
      delete this.purchaseList;
    }
  }

  getCreated( _cellar ): Observable<any> {
    return this.http.get(this.apiConfigService.API_PURCHASE + '/createds/' + _cellar);
  }

  getDeletes({ month, year, _cellar }): Observable<any> {
    return this.http.get(this.apiConfigService.API_PURCHASE + '/deletes/' + _cellar, {
      params: new HttpParams()
        .set('month', month.toString())
        .set('year', year.toString())
    });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PURCHASE}/purchase/${id}`);
  }

  createPurchase(body: PurchaseItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    body._user = this.userID;
    return this.http.post(this.apiConfigService.API_PURCHASE, body);
  }

  statePurchase(body: PurchaseItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_PURCHASE + '/state/' + body._id, body);
  }

  deletePurchase(body: PurchaseItem): Observable<any> {
    body._userDeleted = this.userID;
    return this.http.put(this.apiConfigService.API_PURCHASE + '/delete/' + body._id, body);
  }
}
