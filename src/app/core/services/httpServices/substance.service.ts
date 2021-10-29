import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SubstanceItem } from '../../models/Substance';

@Injectable({
  providedIn: 'root',
})
export class SubstanceService implements IDataService<SubstanceItem[]> {
  public SubstanceList: SubstanceItem[];
  substanceSubject = new Subject<SubstanceItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_SUBSTANCE)
      .pipe(
        map((response: any) => {
          this.SubstanceList = response.substances;
          this.substanceSubject.next(this.SubstanceList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.SubstanceList === undefined) {
      this.loadData();
    } else {
      this.substanceSubject.next(this.SubstanceList);
    }
  }

  readData(): Observable<SubstanceItem[]> {
    return this.substanceSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.SubstanceList === undefined) {
    } else {
      delete this.SubstanceList;
    }
  }
}
