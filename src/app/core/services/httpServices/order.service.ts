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

  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({startDate, endDate, _cellar, _user}) {
    this.http.get(`${this.apiConfigService.API_ORDER}/${_cellar}/${_user}?startDate=${startDate}&endDate=${endDate}`).pipe(
        map((response: any) => {
          this.orderList = response.orders;
          this.orderSubject.next( this.orderList);
    })).subscribe();
  }

  getData(filter: any) {
    const {startDate, endDate, _cellar, _user} = filter;
    if ( this.orderList === undefined ) {
      this.loadData({startDate, endDate, _cellar, _user});
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

  getDispatches(_cellar: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_ORDER + '/dispatches/' + _cellar);
  }

  getRoutes(_cellar: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_ORDER + '/routes/' + _cellar);
  }

  getAdminRoutes(): Observable<any> {
    return this.http.get(this.apiConfigService.API_ORDER + '/adminRoutes/');
  }

  getOrder(id: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_ORDER + '/order/' + id);
  }

  getQuotes({startDate, endDate, _cellar}): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ORDER}/quotes/${_cellar}?startDate=${startDate}&endDate=${endDate}`);
  }

  createOrder(u: OrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.post(this.apiConfigService.API_ORDER, u);
  }

  createQuote(u: OrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.post(this.apiConfigService.API_ORDER + '/quote', u);
  }

  updateOrder(u: OrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.put(this.apiConfigService.API_ORDER + '/' + u._id, u);
  }

  updateOrderState(u: OrderItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_ORDER + '/state/' + u._id, u);
  }

  deleteOrder(u: OrderItem): Observable<any> {
    u._userDeleted = this.userID;
    return this.http.put(this.apiConfigService.API_ORDER + '/delete/' + u._id, u);
  }
}
