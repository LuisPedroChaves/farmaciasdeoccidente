import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiConfigService } from '../services/config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public ApiEndpoints: ApiConfigService,
    private router: Router) { }

  login(user: string, password: string): Observable<any> {
    const body = `username=${user}&password=${password}`;
    return this.http.post(this.ApiEndpoints.API_LOGIN, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).pipe(
      map((response: Response) => response)
    );
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('farmaciasDO-session')) ? JSON.parse(localStorage.getItem('farmaciasDO-session')).token : null;
  }

  logout(id: string): Observable<any> {
    return this.http.put(this.ApiEndpoints.API_LOGOUT + '/' + id, {}).pipe(
      map((response: Response) => response)
    );
  }

  refreshToken() {
    const url = this.ApiEndpoints.API_LOGIN + '/renuevatoken';

    return this.http.get(url)
      .pipe(
        map((response: any) => {

          const session = localStorage.getItem('farmaciasDO-session') ? JSON.parse(localStorage.getItem('farmaciasDO-session')) : null;

          // tslint:disable-next-line: no-string-literal
          const tokenr = response['token'];

          session.token = tokenr;
          if (tokenr) {
            localStorage.setItem('farmaciasDO-session', JSON.stringify(session));
            return true;
          }
        }), catchError((err, caught) => {
          this.router.navigate(['/session/signin']);
          localStorage.removeItem('farmaciasDO-session');
          return throwError(err);
        }));
  }
}
