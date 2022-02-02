import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../config/api-config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BestWorstSellers } from '../../models/ReportSeller';

@Injectable({
  providedIn: 'root',
})
export class SellerReportService implements IDataService<BestWorstSellers[]> {
  public BestSellerList: BestWorstSellers[];
  public WorstSellerList: BestWorstSellers[];

  BestSellertSubject = new Subject<BestWorstSellers[]>();
  WorstSellerSubject = new Subject<BestWorstSellers[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData({startDate, endDate, _cellar}): void {
    this.http
      .get(`${this.apiConfigService.API_BEST_SELLERS}/${_cellar}?startDate=${startDate}&endDate=${endDate}`  )
      .pipe(
        map((response: any) => {
          console.log(response);
          this.BestSellerList = response.BestSellerList;
          this.BestSellertSubject.next(this.BestSellerList);
        })
      )
      .subscribe();
  }

  loadWorstData(): void {
    this.http
      .get(this.apiConfigService.API_WORST_SELLERS)
      .pipe(
        map((response: any) => {
          console.log(response);
          this.WorstSellerList = response.WorstSellerList;
          this.WorstSellerSubject.next(this.WorstSellerList);
        })
      )
      .subscribe();
  }


  getData(filter: any): void {
    const {startDate, endDate, _cellar} = filter;

    if (this.BestSellerList === undefined) {
      this.loadData({startDate, endDate, _cellar});
    } else {
      this.BestSellertSubject.next(this.BestSellerList);
    }
  }

  getWorstData(): void {
    if (this.WorstSellerList === undefined) {
      this.loadWorstData();
    } else {
      this.WorstSellerSubject.next(this.WorstSellerList);
    }
  }

  readData(): Observable<BestWorstSellers[]> {
    return this.BestSellertSubject.asObservable();
  }

  readWorstData(): Observable<BestWorstSellers[]> {
    return this.WorstSellerSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.BestSellerList === undefined) {
    } else {
      delete this.BestSellerList;
    }
  }

  invalidateWorstData(): void {
    if (this.WorstSellerList === undefined) {
    } else {
      delete this.WorstSellerList;
    }
  }
}
