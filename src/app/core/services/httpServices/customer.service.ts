import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDataService } from '../config/i-data-service';
import { ApiConfigService } from '../config/api-config.service';
import { CustomerItem } from '../../models/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements IDataService<CustomerItem[]> {

  public customerList: CustomerItem[];
  customerSubject = new Subject<CustomerItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData() {
    this.http.get(this.apiConfigService.API_CUSTOMER).pipe(
        map((response: any) => {
          this.customerList = response.customers;
          this.customerSubject.next( this.customerList);
    })).subscribe();
  }

  getData() {
    if ( this.customerList === undefined ) {
      this.loadData();
    } else {
      this.customerSubject.next( this.customerList );
    }
  }

  readData(): Observable<CustomerItem[]> {
    return this.customerSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.customerList === undefined) {
    } else {
      delete this.customerList;
    }
  }

  getRecivables(): Observable<any> {
    return this.http.get(this.apiConfigService.API_CUSTOMER + '/recivables');
  }

  getRecivablesBySeller(id: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_CUSTOMER + '/recivablesBySeller/' + id);
  }

  getStatements(id: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_CUSTOMER + '/statements/' + id);
  }

  getCustomer(id: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_CUSTOMER + '/recivables/' + id);
  }

  createCustomer(u: CustomerItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_CUSTOMER, u);
  }

  updateCustomer(u: CustomerItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_CUSTOMER + '/' + u._id, u);
  }

  deleteCustomer(u: CustomerItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_CUSTOMER + '/' + u._id);
  }
}
