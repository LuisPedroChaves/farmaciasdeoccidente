import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { ProviderItem } from '../../models/Provider';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService implements IDataService<ProviderItem[]> {
  public providerList: ProviderItem[];
  providerSubject = new Subject<ProviderItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_PROVIDER)
      .pipe(
        map((response: any) => {
          this.providerList = response.providers;
          this.providerSubject.next(this.providerList);
        })
      )
      .subscribe();
  }

  getData(isExpenses: boolean): void {
    if (this.providerList === undefined) {
      this.loadData();
    } else {
      this.providerSubject.next(this.providerList);
    }
  }

  readData(): Observable<ProviderItem[]> {
    return this.providerSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.providerList === undefined) {
    } else {
      delete this.providerList;
    }
  }

  getExpenses(): Observable<any> {
    return this.http.get(this.apiConfigService.API_PROVIDER + '/isExpenses')
      .pipe(
        map((resp: any) => resp.providers)
      );
  }

  createProvider(u: ProviderItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_PROVIDER, u);
  }
  updateProvider(u: ProviderItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_PROVIDER + '/' + u._id, u);
  }
  updateBalance(body: any): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_PROVIDER}/balance`, body);
  }
  deleteProvider(u: ProviderItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_PROVIDER + '/' + u._id);
  }
}
