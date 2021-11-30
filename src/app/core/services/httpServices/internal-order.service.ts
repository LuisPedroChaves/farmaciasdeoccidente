import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { InternalOrderItem } from '../../models/InternalOrder';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class InternalOrderService implements IDataService<InternalOrderItem[]> {

  public internalOrderList: InternalOrderItem[];
  internalOrderSubject = new Subject<InternalOrderItem[]>();

  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService,
    public websocketS: WebsocketService
  ) { }

  loadData({startDate, endDate, _cellar, type, origin}) {
    this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/' + _cellar + '?startDate=' + startDate + '&endDate=' + endDate + '&type=' + type + '&origin=' + origin).pipe(
        map((response: any) => {
          this.internalOrderList = response.internalOrders;
          this.internalOrderSubject.next( this.internalOrderList);
    })).subscribe();
  }

  getData(filter: any) {
    const {startDate, endDate, _cellar, type, origin} = filter;
    if ( this.internalOrderList === undefined ) {
      this.loadData({startDate, endDate, _cellar, type,origin});
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

  getActives(): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/');
  }

  getActivesCellar(_cellar: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/activesCellar/' + _cellar);
  }

  getDelivery(_delivery: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/actives/' + _delivery);
  }

  getOutgoing(_destination: string, type: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/outgoing/' + _destination + '?type=' + type);
  }

  getNewIncoming() {
    return this.websocketS.listen('newInternalOrder');
  }

  getUpdateIncoming() {
    return this.websocketS.listen('updateIncoming');
  }

  getUpdateOutgoing() {
    return this.websocketS.listen('updateOutgoing');
  }

  getIncoming(_cellar: string, type: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_INTERNAL_ORDER + '/incoming/' + _cellar + '?type=' + type);
  }

  createInternalOrder(u: any): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.post(this.apiConfigService.API_INTERNAL_ORDER, u);
  }


  createInternalOrderNew(u: any): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.post(this.apiConfigService.API_INTERNAL_ORDER, u);
  }

  updateInternalOrder(u: any): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    u._user = this.userID;
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/' + u._id, u);
  }

  updateInternalOrderState(u: any): Observable<any> {
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/state/' + u._id, u);
  }

  deleteInternalOrder(u: InternalOrderItem): Observable<any> {
    // u._userDeleted = this.userID;
    return this.http.put(this.apiConfigService.API_INTERNAL_ORDER + '/delete/' + u._id, u);
  }
}
