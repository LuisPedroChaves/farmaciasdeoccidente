import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankItem } from '../../models/Bank';
import { ApiConfigService } from '../config/api-config.service';
import { IDataService } from '../config/i-data-service';

@Injectable({
  providedIn: 'root'
})
export class BankService implements IDataService<BankItem[]> {
  public bankList: BankItem[];
  bankSubject = new Subject<BankItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData(): void {
    this.http
      .get(this.apiConfigService.API_BANK)
      .pipe(
        map((response: any) => {

          this.bankList = response.banks;
          this.bankSubject.next(this.bankList);
        })
      )
      .subscribe();
  }

  getData(): void {
    if (this.bankList === undefined) {
      this.loadData();
    } else {
      this.bankSubject.next(this.bankList);
    }
  }

  readData(): Observable<BankItem[]> {
    return this.bankSubject.asObservable();
  }

  setData(): void { }

  invalidateData(): void {
    if (this.bankList === undefined) {
    } else {
      delete this.bankList;
    }
  }

  create(bank: BankItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_BANK, bank);
  }

  update(bank: BankItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_BANK + '/' + bank._id, bank);
  }

  delete(bank: BankItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_BANK + '/' + bank._id, {
      params: new HttpParams()
        .set('details', details.toString())
    });
  }
}
