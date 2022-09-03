import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PayrollItem } from '../../models/Payroll';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  public payrollList: PayrollItem[];
  payrollSubject = new Subject<PayrollItem[]>();
  constructor(public http: HttpClient, public apiConfigService: ApiConfigService) { }



  loadData() {
    this.http.get(this.apiConfigService.API_PAYROLL).pipe(map((resp: any) => {
      this.payrollList = resp.payrolls;
      this.payrollSubject.next(this.payrollList);
    })).subscribe();
  }


  getData() {
    if (this.payrollList === undefined) {
      this.loadData();
    } else {
      this.payrollSubject.next(this.payrollList);
    }
  }

  readData(): Observable<any> {
    return this.payrollSubject.asObservable();
  }
}
