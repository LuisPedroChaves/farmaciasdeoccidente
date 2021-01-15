import { Component, NgZone, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { AppState } from 'src/app/core/store/app.reducer';
import * as actions from '../../../core/store/actions';
import { CellarService } from '../../../core/services/httpServices/cellar.service';
import { ChildrenItems, MenuItem } from 'src/app/core/models/Menu';
import { MenuService } from '../../../core/services/httpServices/menu.service';
import { RoleService } from '../../../core/services/httpServices/role.service';
import { PermissionItem } from 'src/app/core/models/Role';
import { HttpClient } from '@angular/common/http';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy, AfterContentInit {

  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  sessionSubscription: Subscription;
  currentuser: any;
  isAdmin = false;
  currentStore: any = {
    name: ''
  };

  cellars: CellarItem[];
  menuItems: MenuItem[] = [];
  myrole: PermissionItem[];
  collapse = true;
  sidePanelOpened;

  menuItems2 = [
    { state: '/', name: 'Inicio', type: 'link', icon: 'dashboard', order: 1 },
    {
      state: '/factory/production', name: 'Transferencias', type: 'sub', order: 2,icon: 'wifi_protected_setup',
      children: [
        // tslint:disable-next-line: max-line-length
        { state: '/factory/production', name: 'Manufactura', type: 'link', icon: 'settings' },
        { state: '/factory/products', name: 'Productos', type: 'link', icon: 'widgets' },
        { state: '/factory/inventory', name: 'Inventario', type: 'link', icon: 'assignment' },
      ]
    },
    { state: '/orders', name: 'Ordenes', type: 'link', icon: 'receipt_long', order: 3 },
    { state: '/dispatches', name: 'Despachos', type: 'link', icon: 'receipt_long', order: 3 },
    {
      state: '/factory/sales', name: 'Rutas', type: 'sub', order: 4, icon: 'electric_moped',
      children: [
        { state: '/factory/billing', name: 'Facturación', type: 'link', svg: 'M2,17H22V21H2V17M6.25,7H9V6H6V3H14V6H11V7H17.8C18.8,7 19.8,8 20,9L20.5,16H3.5L4.05,9C4.05,8 5.05,7 6.25,7M13,9V11H18V9H13M6,9V10H8V9H6M9,9V10H11V9H9M6,11V12H8V11H6M9,11V12H11V11H9M6,13V14H8V13H6M9,13V14H11V13H9M7,4V5H13V4H7Z' },
        { state: '/customers', name: 'Clientes', type: 'link', icon: 'person' }
      ]
    },
    { state: '/factory/employees', name: 'Empleados', type: 'link', icon: 'work_outlined' },
    { state: '/customers', name: 'Catálogo de clientes', type: 'link', order: 4, icon: 'supervised_user_circle' },
    { state: '/customersRoutes', name: 'Catálogo de clientes', type: 'link', order: 4, icon: 'person_pin_circle' },
    { state: '/factory/providers', name: 'Cuentas por Cobrar', type: 'link', icon: 'request_quote', order: 2 },
  ];

  constructor(
    zone: NgZone,
    public store: Store<AppState>,
    public router: Router,
    public cellarService: CellarService,
    public menuService: MenuService,
    public roleService: RoleService,
    public http: HttpClient,
    ) {
    // tslint:disable-next-line: deprecation
    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
    }));
    if (this.mediaMatcher.matches) {
      this.collapse = false;
    }
  }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter( session => session !== null )).subscribe(session => {
      this.currentuser = session.currentUser;
      if (session !== null) {
        if (session.token === null) {
          this.router.navigate(['session/signin']);
        }
      }
      if (this.currentuser) {
        if (this.currentuser.type === 'ADMIN') {
          this.isAdmin = true;
        }
      }
    });
    setTimeout(() => {
      if (localStorage.getItem('currentstore')) {
        this.currentStore = JSON.parse(localStorage.getItem('currentstore'));
      }
    }, 1000);

    this.cellarService.readData().subscribe(data => { this.cellars = data; });
    combineLatest([
      this.roleService.getMyRole(),
      this.menuService.initMenu()
    ]).subscribe(data => {
      if (data[0].role.type === 'ADMIN') {
        this.http.get<MenuItem[]>('/assets/data/modules.json').subscribe((result: any) => {
          this.myrole = result;
          this.store.dispatch(actions.setMyRole({ myroles: this.myrole }));
          this.calculateMenu(data[1], this.myrole);
        });
      }else {
        this.myrole = data[0].role.permissions;
        this.store.dispatch(actions.setMyRole({ myroles: this.myrole }));
        this.calculateMenu(data[1], this.myrole);
      }
    });
  }

  ngOnDestroy() {
    this.sessionSubscription?.unsubscribe();
    this.isAdmin = false;
  }

  ngAfterContentInit() {
    this.cellarService.getData();
  }

  calculateMenu(menu: MenuItem[], permissions: PermissionItem[] ) {
    const parents = permissions.filter(p => p.level === 1);
    parents.forEach(p => {
      const childrens = permissions.filter(mp => mp.parent === p.name);
      const parentEquivalent: MenuItem = menu.filter(m => m.state === p.name)[0];
      if (childrens.length > 0) {
        parentEquivalent.children = [];
        childrens.forEach(c => {
          const childmenu: ChildrenItems = menu.filter(mc => mc.state === c.name)[0];
          parentEquivalent.children.push(childmenu);
        });
      }
      this.menuItems.push(parentEquivalent);
    });
  }

  back() {
    localStorage.removeItem('currentstore');
    this.router.navigate(['/admin']);
  }

  accessToCellar(c: CellarItem) {
    localStorage.setItem('currentstore', JSON.stringify(c));
    this.currentStore = c;
    switch (c.type) {
      case 'FARMACIA':
        this.router.navigate(['/']);
        break;
      case 'BODEGA':
        this.router.navigate(['/factory']);
        break;

      default:
        break;
    }

    // location.reload();
  }

  getImage() {
    if (localStorage.getItem('farmaciasDO-session') !== null) {
      const user = JSON.parse(localStorage.getItem('farmaciasDO-session')).user;
      switch (user.imageIndex) {
        case 0: return '/assets/images/avatars/01.png';
        case 1: return '/assets/images/avatars/02.png';
        case 2: return '/assets/images/avatars/03.png';
        case 3: return '/assets/images/avatars/04.png';
        case 4: return '/assets/images/avatars/05.png';
        case 5: return '/assets/images/avatars/00M.jpg';
        case 6: return '/assets/images/avatars/00F.jpg';
      }
    } else {
      return '/assets/images/avatars/00M.jpg';
    }
  }

  getTypeIcon(t: string): string {
    let icon = '';
    switch (t) {
      case 'BODEGA': icon = 'store'; break;
      case 'FARMACIA': icon = 'local_pharmacy'; break;
    }
    return icon;
  }

  logout(): void {
    localStorage.removeItem('farmaciasDO-session');
    localStorage.removeItem('currentstore');
    this.store.dispatch(actions.logoutSuccess());
  }

}
