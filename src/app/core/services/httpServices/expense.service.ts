import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { ExpenseItem } from '../../models/Expense';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService implements IDataService<ExpenseItem[]> {
  public expenseList: ExpenseItem[];
  expenseSubject = new Subject<ExpenseItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_EXPENSE)
      .pipe(
        map((response: any) => {

          this.expenseList = response.expenses;
          this.expenseSubject.next(this.expenseList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.expenseList === undefined) {
      this.loadData();
    } else {
      this.expenseSubject.next(this.expenseList);
    }
  }

  readData(): Observable<ExpenseItem[]> {
    return this.expenseSubject.asObservable();
  }

  setData(): void {}

  invalidateData(): void {
    if (this.expenseList === undefined) {
    } else {
      delete this.expenseList;
    }
  }

  create(expense: ExpenseItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_EXPENSE, expense);
  }

  delete(expense: ExpenseItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_EXPENSE + '/' + expense._id);
  }
}
