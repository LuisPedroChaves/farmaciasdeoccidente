import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiscountItem } from '../../models/Discounts';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {


  public discountList: DiscountItem[];
  discountSubject = new Subject<DiscountItem[]>();
  constructor(public http: HttpClient, public apiConfigService: ApiConfigService) { }



  loadData() {
    this.http.get(this.apiConfigService.API_DISCOUNTS).pipe(map((resp: any) => {
      this.discountList = resp.discounts;
      this.discountSubject.next(this.discountList);
    })).subscribe();
  }


  getData() {
    if (this.discountList === undefined) {
      this.loadData();
    } else {
      this.discountSubject.next(this.discountList);
    }
  }

  readData(): Observable<any> {
    return this.discountSubject.asObservable();
  }



  create(discount: DiscountItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_DISCOUNTS, discount);
  }

  update(discount: DiscountItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_DISCOUNTS}/${discount._id}`, discount);
  }

  delete(discount: DiscountItem): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_DISCOUNTS}/${discount._id}`);
  }


}
