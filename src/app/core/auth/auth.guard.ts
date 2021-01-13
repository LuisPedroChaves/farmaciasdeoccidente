import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      if (localStorage.getItem('farmaciasDO-session')) {
        return true;
        if (JSON.parse(localStorage.getItem('farmaciasDO-session')).type !== 'ADMIN') {
        }
      }
      // not logged in so redirect to login page with the return url
      // if (localStorage.getItem('farmaciasDO-session')) {
      //   if (JSON.parse(localStorage.getItem('farmaciasDO-session')).type === 'ADMIN') {
      //     this.router.navigate(['admin']);
      //     return false;
      //   } else {
      //     localStorage.removeItem('farmaciasDO-session');
      //     this.router.navigate(['session/signin']);
      //     return false;
      //   }
      // } else {
      // }
      localStorage.removeItem('farmaciasDO-session');
      this.router.navigate(['session/signin']);
      return false;
  }
}
