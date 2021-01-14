import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CellarItem } from '../../models/Cellar';
import { IDataService } from '../config/i-data-service';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CellarService implements IDataService<CellarItem[]> {

  public cellarList: CellarItem[];
  cellarSubject = new Subject<CellarItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData() {
    this.http.get(this.apiConfigService.API_CELLAR).pipe(
        map((response: any) => {
          this.cellarList = response.cellars;
          this.cellarSubject.next( this.cellarList);
    })).subscribe();
  }

  getData() {
    if ( this.cellarList === undefined ) {
      this.loadData();
    } else {
      this.cellarSubject.next( this.cellarList );
    }
  }

  readData(): Observable<CellarItem[]> {
    return this.cellarSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.cellarList === undefined) {
    } else {
      delete this.cellarList;
    }
  }

  createCellar(u: CellarItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_CELLAR, u);
  }

  updateCellar(u: CellarItem): Observable<any> {
    const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_CELLAR + '/' + u._id, jsonParms);
  }

  deleteCellar(u: CellarItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_CELLAR + '/' + u._id);
  }

}
