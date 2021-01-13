import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class DashboardGuard implements CanActivate {

  constructor(private router: Router) {
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('farmaciasDO-session')) {
            if (JSON.parse(localStorage.getItem('farmaciasDO-session')).type === 'ADMIN') {
                return true;
            } else {
                if (JSON.parse(localStorage.getItem('farmaciasDO-session')).type === 'seo') { //TODO: agregar DASHBOARDS
                    this.router.navigate(['/dashboard-seo']);
                    return false;
                } else {
                    this.router.navigate(['/dashboard-cpo']);
                    return false;

                }
            }
        }

    }
}
