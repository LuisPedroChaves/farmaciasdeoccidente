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

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_BRAND)
      .pipe(
        map((response: any) => {
          this.brandList = response.brands;
          this.brandSubject.next(this.brandList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.brandList === undefined) {
      this.loadData();
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

  create(brand: BrandItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_BRAND, brand);
  }

  update(brand: BrandItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_BRAND + '/' + brand._id, brand);
  }

  delete(brand: BrandItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_BRAND + '/' + brand._id);
  }
}
