import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiConfigService } from '../config/api-config.service';
import { PurchaseItem } from '../../models/Purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  userID = JSON.parse(localStorage.getItem('farmaciasDO-session')).id;

  constructor(
    private http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  createPurchase(body: PurchaseItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    body._user = this.userID;
    return this.http.post(this.apiConfigService.API_PURCHASE, body);
  }
}
