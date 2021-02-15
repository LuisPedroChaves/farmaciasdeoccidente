import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { InternalOrderItem } from '../../models/InternalOrder';

@Injectable({
  providedIn: 'root'
})
export class InternalOrderService implements IDataService<InternalOrderItem[]> {

  public internalOrderList: InternalOrderItem[];
  internalOrderSubject = new Subject<InternalOrderItem[]>();

  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({month, year, _cellar, type}) {
    this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/' + _cellar + '?month=' + month + '&year=' + year + '&type=' + type).pipe(
        map((response: any) => {
          this.internalOrderList = response.internalOrders;
          this.internalOrderSubject.next( this.internalOrderList);
    })).subscribe();
  }

  getData(filter: any) {
    const {month, year, _cellar, type} = filter;
    if ( this.internalOrderList === undefined ) {
      this.loadData({month, year, _cellar, type});
    } else {
      this.internalOrderSubject.next( this.internalOrderList );
    }
  }

  readData(): Observable<InternalOrderItem[]> {
    return this.internalOrderSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.internalOrderList === undefined) {
    } else {
      delete this.internalOrderList;
    }
  }

  getDelivery(_delivery: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/actives/' + _delivery);
  }

  getOutgoing(_cellar: string, type: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/outgoing/' + _cellar + '?type=' + type);
  }

  getIncoming(_destination: string, type: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/incoming/' + _destination + '?type=' + type);
  }

  createInternalOrder(u: InternalOrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.post(this.apiConfigService.API_INTERNAL_ORDER, u);
  }

  updateInternalOrder(u: InternalOrderItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/' + u._id, u);
  }

  updateInternalOrderState(u: InternalOrderItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/state/' + u._id, u);
  }

  deleteInternalOrder(u: InternalOrderItem): Observable<any> {
    // u._userDeleted = this.userID;
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/delete/' + u._id, u);
  }
}
