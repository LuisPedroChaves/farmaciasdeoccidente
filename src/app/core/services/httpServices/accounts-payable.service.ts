import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IDataService } from '../config/i-data-service';
import { AccountsPayableItem } from '../../models/AccountsPayable';
import { ApiConfigService } from '../config/api-config.service';

/* #region  Contratos de los endpoints paginados */
export interface AccountsPayablePagedParams {
  page: number;
  size: number;
  type?: 'PRODUCTOS' | 'GASTOS';
  docType?: string;
  _provider?: string;
  withholdings?: boolean;
  pending?: boolean;
  expired?: boolean;
  search?: string;
}

export interface AccountsPayablePaged {
  accountsPayables: AccountsPayableItem[];
  total: number;
}

export interface AccountsPayableCounts {
  withholdings: number;
  products: number;
  expenses: number;
  tempCredits: number;
}

export interface ProviderTotals {
  bills: number;
  credits: number;
  creditNotes: number;
  pending: number;
  inProcess: number;
  withholdings: number;
  expired: number;
}

export const EMPTY_PROVIDER_TOTALS: ProviderTotals = {
  bills: 0,
  credits: 0,
  creditNotes: 0,
  pending: 0,
  inProcess: 0,
  withholdings: 0,
  expired: 0,
};
/* #endregion */

@Injectable({
  providedIn: 'root'
})
export class AccountsPayableService implements IDataService<AccountsPayableItem[]> {

  /**
   * Notificador de cambios. Antes `loadData()` descargaba la lista completa de
   * pendientes (30k documentos) y la repartía por un Subject; ahora los listados
   * se paginan en el servidor, así que `loadData()` solo avisa a las vistas
   * abiertas para que recarguen su página actual.
   */
  private refreshSubject = new Subject<void>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  /* #region  IDataService (compatibilidad) */
  loadData(): void {
    this.refreshSubject.next();
  }

  getData(): void {
    this.refreshSubject.next();
  }

  /** @deprecated Usar `onRefresh()` y los métodos paginados. */
  readData(): Observable<AccountsPayableItem[]> {
    return new Subject<AccountsPayableItem[]>().asObservable();
  }

  setData(): void { }

  invalidateData(): void { }
  /* #endregion */

  /** Se emite cada vez que otro componente crea, edita, paga o anula un documento. */
  onRefresh(): Observable<void> {
    return this.refreshSubject.asObservable();
  }

  /* #region  Listados paginados */
  getUnpaidsPaged(params: AccountsPayablePagedParams): Observable<AccountsPayablePaged> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.type) { httpParams = httpParams.set('type', params.type); }
    if (params.docType) { httpParams = httpParams.set('docType', params.docType); }
    if (params._provider) { httpParams = httpParams.set('_provider', params._provider); }
    if (params.withholdings) { httpParams = httpParams.set('withholdings', 'true'); }
    if (params.expired) { httpParams = httpParams.set('expired', 'true'); }
    if (params.pending !== undefined) { httpParams = httpParams.set('pending', String(params.pending)); }
    if (params.search) { httpParams = httpParams.set('search', params.search); }

    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/unpaids/paged`, { params: httpParams })
      .pipe(
        map((resp: any) => ({
          accountsPayables: resp.accountsPayables || [],
          total: resp.total || 0,
        }))
      );
  }

  getUnpaidsCounts(): Observable<AccountsPayableCounts> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/unpaids/counts`)
      .pipe(
        map((resp: any) => ({
          withholdings: 0,
          products: 0,
          expenses: 0,
          tempCredits: 0,
          ...(resp.counts || {}),
        }))
      );
  }

  getProviderTotals(_provider: string): Observable<ProviderTotals> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/provider/${_provider}/totals`)
      .pipe(
        map((resp: any) => ({ ...EMPTY_PROVIDER_TOTALS, ...(resp.totals || {}) }))
      );
  }
  /* #endregion */

  getReportExpenses(startDate, endDate): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/expenses`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getReportProvider(startDate, endDate, _provider: string = null): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/report/${_provider}`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getHistory(startDate, endDate, _provider: string = null): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/history/${_provider}`, {
      params: new HttpParams()
        .set('startDate', startDate.toString())
        .set('endDate', endDate.toString())
    })
      .pipe(
        map((resp: any) => resp.accountsPayables)
      );
  }

  getReportDuplicates(page: number, size: number, startDate?, endDate?, _provider?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (startDate) params = params.set('startDate', startDate.toString());
    if (endDate) params = params.set('endDate', endDate.toString());
    if (_provider) params = params.set('_provider', _provider);

    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/report/duplicates`, { params })
      .pipe(map((resp: any) => ({ duplicates: resp.duplicates, total: resp.total })));
  }

  getTempCredits(): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_ACCOUNTS_PAYABLE}/tempCredits`)
      .pipe(
        map((resp: any) => resp.accountsPayables)
      )
  }

  create(accountPayable: AccountsPayableItem): Observable<any> {
    accountPayable._user = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;
    return this.http.post(this.apiConfigService.API_ACCOUNTS_PAYABLE, accountPayable);
  }

  update(accountPayable: AccountsPayableItem): Observable<any> {
    return this.http.put(this.apiConfigService.API_ACCOUNTS_PAYABLE + '/' + accountPayable._id, accountPayable);
  }

  delete(accountPayable: AccountsPayableItem, details: string): Observable<any> {
    return this.http.delete(this.apiConfigService.API_ACCOUNTS_PAYABLE + '/' + accountPayable._id, {
      params: new HttpParams()
        .set('details', details.toString())
    });
  }
}
