import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {

  constructor(public authS: AuthService, public router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.authS.getToken();
    const payload = JSON.parse(atob(token.split('.')[1]));

    const expired = this.expired(payload.exp);
    if (expired) {
      localStorage.removeItem('farmaciasDO-session');
      this.router.navigate(['/session/signin']);
      return false;
    }

    return this.verifyRefresh(payload.exp);
  }

  verifyRefresh(expDate: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(expDate * 1000);
      const now = new Date();

      now.setTime(now.getTime() + (4 * 60 * 60 * 1000));


      if (tokenExp.getTime() > now.getTime()) {
        resolve(true);
      } else {
        this.authS.refreshToken().subscribe(() => { resolve(true); }, () => {
            reject(false); localStorage.removeItem('farmaciasDO-session'); this.router.navigate(['/session/login']);
        });
      }

      resolve(true);
    });
  }

  expired(dateExp: number) {
    const now = new Date().getTime() / 1000;

    if (dateExp < now) {
      return true;
    } else {
      return false;
    }
  }
}
