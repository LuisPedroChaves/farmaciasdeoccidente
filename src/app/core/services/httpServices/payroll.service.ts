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



  startPayroll(cellars: string[]): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PAYROLL_NEW}?cellars=${cellars}`);
  }

  createPayroll(p: PayrollItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_PAYROLL, p);
  }

  updatePayroll(p: PayrollItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_PAYROLL}/${p._id}`, p);
  }

  gePayroll(id: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_PAYROLL}/${id}`);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_PAYROLL}/${id}`);
  }
}
