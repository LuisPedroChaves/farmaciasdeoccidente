import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { RouteItem } from '../../models/Route';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api-config.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService implements IDataService<RouteItem[]> {

  public routeList: RouteItem[];
  routeSubject = new Subject<RouteItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData({month, year, _user, _cellar}) {
    this.http.get(this.apiConfigService.API_ROUTE + '/' + _user + '/' + _cellar + '?month=' + month + '&year=' + year).pipe(
        map((response: any) => {
          this.routeList = response.routes;
          this.routeSubject.next( this.routeList);
    })).subscribe();
  }

  getData(filter: any) {
    const {month, year, _user, _cellar} = filter;
    if ( this.routeList === undefined ) {
      this.loadData({month, year, _user, _cellar});
    } else {
      this.routeSubject.next( this.routeList );
    }
  }

  readData(): Observable<RouteItem[]> {
    return this.routeSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.routeList === undefined) {
    } else {
      delete this.routeList;
    }
  }

  getActives(_user: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_ROUTE + '/active/' + _user);
  }

  createRoute(u: RouteItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_ROUTE, u);
  }

  updateRouter(u: RouteItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_ROUTE + '/' + u._id, u);
  }

  updateRouterState(u: RouteItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_ROUTE + '/state/' + u._id, u);
  }

  deleteRoute(u: RouteItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_ROUTE + '/' + u._id);
  }
}
