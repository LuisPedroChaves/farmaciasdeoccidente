import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderItem } from '../../models/Order';
import { ApiConfigService } from '../config/api-config.service';
import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements IDataService<OrderItem[]> {

  public orderList: OrderItem[];
  orderSubject = new Subject<OrderItem[]>();

  cellarID = JSON.parse(localStorage.getItem('currentstore'))._id;
  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({month, year}) {
    this.http.get(this.apiConfigService.API_ORDER + '/' + this.cellarID + '?month=' + month + '&year=' + year).pipe(
        map((response: any) => {
          this.orderList = response.orders;
          this.orderSubject.next( this.orderList);
    })).subscribe();
  }

  getData(filter: any) {
    const {month, year} = filter;
    if ( this.orderList === undefined ) {
      this.loadData({month, year});
    } else {
      this.orderSubject.next( this.orderList );
    }
  }

  readData(): Observable<OrderItem[]> {
    return this.orderSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.orderList === undefined) {
    } else {
      delete this.orderList;
    }
  }

  createOrder(u: OrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._cellar = this.cellarID;
    u._user = this.userID;
    console.log("🚀 ~ file: order.service.ts ~ line 58 ~ OrderService ~ createOrder ~ u", u)
    return this.http.post(this.apiConfigService.API_ORDER, u);
  }

  updateOrder(u: OrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_ORDER + '/' + u._id, u);
  }

  deleteOrder(u: OrderItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_ORDER + '/' + u._id);
  }
}
