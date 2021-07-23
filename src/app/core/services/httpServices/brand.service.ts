import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { BrandItem } from '../../models/Brand';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService implements IDataService<BrandItem[]> {
  public brandList: BrandItem[];
  brandSubject = new Subject<BrandItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData({ page }): void {
    this.http
      .get(this.apiConfigService.API_BRAND + '?page=' + page + '&size=20')
      .pipe(
        map((response: any) => {
          this.brandList = response.brands;
          this.brandSubject.next(this.brandList);
        })
      )
      .subscribe();
  }

  getData(filter: any): void {
    const { page } = filter;
    if (this.brandList === undefined) {
      this.loadData({ page });
    } else {
      this.brandSubject.next(this.brandList);
    }
  }

  readData(): Observable<BrandItem[]> {
    return this.brandSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.brandList === undefined) {
    } else {
      delete this.brandList;
    }
  }
}
