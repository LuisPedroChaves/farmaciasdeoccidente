import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { CheckItem } from '../../models/Check';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService implements IDataService<CheckItem[]> {

  public checkList: CheckItem[];
  checkSubject = new Subject<CheckItem[]>();
  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(`${this.apiConfigService.API_CHECK}`)
      .pipe(
        map((response: any) => {

          this.checkList = response.checks;
          this.checkSubject.next(this.checkList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.checkList === undefined) {
      this.loadData();
    } else {
      this.checkSubject.next(this.checkList);
    }
  }

  readData(): Observable<CheckItem[]> {
    return this.checkSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.checkList === undefined) {
    } else {
      delete this.checkList;
    }
  }

  create(check: CheckItem): Observable<any> {
    check._user = this.userID;
    return this.http.post(this.apiConfigService.API_CHECK, check);
  }

  update(check: CheckItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_CHECK + '/' + check._id, check);
  }
}
