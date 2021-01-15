import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class DashboardGuard implements CanActivate {

    constructor(private router: Router) {
    }


    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('currentstore')) {
            const type = JSON.parse(localStorage.getItem('currentstore')).type;
            switch (type) {
                case 'FARMACIA':
                    return true;
                case 'BODEGA':
                    this.router.navigate(['/factory']);
                    return false;
                default:
                    break;
            }
        }else {
            this.router.navigate(['/delivery']);
            return false;
        }

    }
}