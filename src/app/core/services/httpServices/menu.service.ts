import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { ApiConfigService } from '../config/api-config.service';
import { Observable } from 'rxjs';
import { MenuItem } from '../../models/Menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
    public apiConfigService: ApiConfigService
  ) { }

  initMenu(): Observable<MenuItem[]> {
    let url = this.apiConfigService.API_MENU;

    return this.http.get<MenuItem[]>(url);
  }
}
