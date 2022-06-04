import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from '../config/api-config.service';
import { BankAccountItem } from '../../models/Bank';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  read(): Observable<BankAccountItem[]> {
    return this.http.get(`${this.apiConfigService.API_BANK_ACCOUNT}`)
      .pipe(
        map((resp: any) => resp.bankAccounts)
      )
  }

  create(bankAccount: BankAccountItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_BANK_ACCOUNT, bankAccount)
      .pipe(
        map((resp: any) => resp.bankAccount)
      )
  }

  update(bankAccount: BankAccountItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_BANK_ACCOUNT + '/' + bankAccount._id, bankAccount)
    .pipe(
      map((resp: any) => resp.bankAccount)
    )
  }

  delete(bankAccount: BankAccountItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_BANK_ACCOUNT + '/' + bankAccount._id, {
      params: new HttpParams()
        .set('details', details.toString())
    });
  }
}
