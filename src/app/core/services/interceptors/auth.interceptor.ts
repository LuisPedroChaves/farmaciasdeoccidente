import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenstorege = this.authService.getToken();
    if (tokenstorege !== null) {
      // const tokenizedReq = request.clone({ setHeaders: { 'Content-Type':  'application/json', Authorization: 'Bearer ' + token} });
      const tokenizedReq = request.clone({ setHeaders: { 'Content-Type':  'application/json', token: tokenstorege } });
      return next.handle(tokenizedReq);
    } else {
      return next.handle(request);
    }
  }
}
