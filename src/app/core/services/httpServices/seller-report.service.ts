import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  BestSellerSubject = new Subject<BestWorstSellers[]>();
  WorstSellerSubject = new Subject<BestWorstSellers[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) {}

  loadData({startDate, endDate, _cellar}): void {
    console.log(startDate, endDate, _cellar);
    this.http
      .get(`${this.apiConfigService.API_BEST_SELLERS}`, {
        params: new HttpParams()
      .set('_cellar', _cellar.toString())
      .set('startDate', startDate.toString())
      .set('endDate', endDate.toString())
    }  )
      .pipe(
        map((response: any) => {
          this.BestSellerList = response.tempSales;
          this.BestSellerSubject.next(this.BestSellerList);
        })
      )
      .subscribe();
  }

  loadWorstData({startDate, endDate, _cellar}): void {
    console.log(startDate, endDate, _cellar);
    this.http
      .get(`${this.apiConfigService.API_WORST_SELLERS}`, {
        params: new HttpParams()
      .set('_cellar', _cellar.toString())
      .set('startDate', startDate.toString())
      .set('endDate', endDate.toString())
    }  )
      .pipe(
        map((response: any) => {
          this.WorstSellerList = response.tempSales;
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
      this.BestSellerSubject.next(this.BestSellerList);
    }
  }

  getWorstData(filter: any): void {
    const {startDate, endDate, _cellar} = filter;
    if (this.WorstSellerList === undefined) {
      this.loadWorstData({startDate, endDate, _cellar});
    } else {
      this.WorstSellerSubject.next(this.WorstSellerList);
    }
  }

  readData(): Observable<BestWorstSellers[]> {
    return this.BestSellerSubject.asObservable();
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
