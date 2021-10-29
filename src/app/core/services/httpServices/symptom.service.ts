import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SymptomItem } from '../../models/Symptom';

@Injectable({
  providedIn: 'root',
})
export class SymptomService implements IDataService<SymptomItem[]> {
  public SymptomList: SymptomItem[];
  SymptomSubject = new Subject<SymptomItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_SYMPTOM)
      .pipe(
        map((response: any) => {
          this.SymptomList = response.symptoms;
          this.SymptomSubject.next(this.SymptomList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.SymptomList === undefined) {
      this.loadData();
    } else {
      this.SymptomSubject.next(this.SymptomList);
    }
  }

  readData(): Observable<SymptomItem[]> {
    return this.SymptomSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.SymptomList === undefined) {
    } else {
      delete this.SymptomList;
    }
  }
}
