import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RisingItem } from '../../models/Risings';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class RisingsService {

  public risingList: RisingItem[];
  risingSubject = new Subject<RisingItem[]>();
  constructor(public http: HttpClient, public apiConfigService: ApiConfigService) { }



  loadData() {
    this.http.get(this.apiConfigService.API_RISINGS).pipe(map((resp: any) => {
      this.risingList = resp.risings;
      this.risingSubject.next(this.risingList);
    })).subscribe();
  }


  getData() {
    if (this.risingList === undefined) {
      this.loadData();
    } else {
      this.risingSubject.next(this.risingList);
    }
  }

  readData(): Observable<any> {
    return this.risingSubject.asObservable();
  }



  create(rising: RisingItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_RISINGS, rising);
  }

  update(rising: RisingItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_RISINGS}/${rising._id}`, rising);
  }

  delete(rising: RisingItem): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_RISINGS}/${rising._id}`);
  }



  getRisingByEmployee(id: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_RISINGS}/${id}`);
  }
}
