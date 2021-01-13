import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';

@Injectable()
export class AuthAdminGuard implements CanActivate {

  constructor(private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('farmaciasDO-session')) {
      if (JSON.parse(localStorage.getItem('farmaciasDO-session')).type === 'ADMIN') {
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    localStorage.removeItem('farmaciasDO-session');
    this.router.navigate(['session/signin']);
    return false;
  }
}
