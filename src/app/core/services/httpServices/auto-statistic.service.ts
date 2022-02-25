import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { AutoStatisticItem } from '../../models/AutoStatistic';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AutoStatisticService implements IDataService<AutoStatisticItem[]> {
  public autoStatisticList: AutoStatisticItem[];
  autoStatisticSubject = new Subject<AutoStatisticItem[]>();
  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_AUTO_STATISTIC)
      .pipe(
        map((response: any) => {

          this.autoStatisticList = response.autoStatistics;
          this.autoStatisticSubject.next(this.autoStatisticList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.autoStatisticList === undefined) {
      this.loadData();
    } else {
      this.autoStatisticSubject.next(this.autoStatisticList);
    }
  }

  readData(): Observable<AutoStatisticItem[]> {
    return this.autoStatisticSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.autoStatisticList === undefined) {
    } else {
      delete this.autoStatisticList;
    }
  }

  create(autoStatistic: AutoStatisticItem): Observable<any> {
    autoStatistic._user = this.userID;
    return this.http.post(this.apiConfigService.API_AUTO_STATISTIC, autoStatistic);
  }

  update(autoStatistic: AutoStatisticItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_AUTO_STATISTIC + '/' + autoStatistic._id, autoStatistic);
  }

  delete(autoStatistic: AutoStatisticItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_AUTO_STATISTIC + '/' + autoStatistic._id);
  }
}
