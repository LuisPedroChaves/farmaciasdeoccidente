import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { SaleItem } from '../../models/Sale';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api-config.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaleService implements IDataService<SaleItem[]> {

  public saleList: SaleItem[];
  saleSubject = new Subject<SaleItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({startDate, endDate, _cellar}) {
    this.http.get(this.apiConfigService.API_SALE + '/' + _cellar + '?startDate=' + startDate + '&endDate=' + endDate).pipe(
        map((response: any) => {
          this.saleList = response.sales;
          this.saleSubject.next( this.saleList);
    })).subscribe();
  }

  getData(filter: any) {
    const {startDate, endDate, _cellar} = filter;
    if ( this.saleList === undefined ) {
      this.loadData({startDate, endDate, _cellar});
    } else {
      this.saleSubject.next( this.saleList );
    }
  }

  readData(): Observable<SaleItem[]> {
    return this.saleSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.saleList === undefined) {
    } else {
      delete this.saleList;
    }
  }

  getHistory(id: string, startDate, endDate): Observable<any> {
    return this.http.get(this.apiConfigService.API_SALE + '/history/' + id + '?startDate=' + startDate + '&endDate=' + endDate);
  }

  createSale(u: SaleItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_SALE, u);
  }

  updateSale(u: SaleItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_SALE + '/' + u._id, u);
  }

  // updateOrderState(u: SaleItem): Observable<any> {
  //   return this.http.put(this.apiConfigService.API_SALE + '/state/' + u._id, u);
  // }

  deleteSale(u: SaleItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_SALE + '/' + u._id);
  }
}
