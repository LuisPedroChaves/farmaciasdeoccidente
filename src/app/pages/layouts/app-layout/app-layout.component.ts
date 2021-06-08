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
import { WebsocketService } from '../../../core/services/httpServices/websocket.service';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { NotificationItem } from 'src/app/core/models/Notification';
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
  notifications: NotificationItem[] = [];
  collapse = true;
  sidePanelOpened;
  currentPanel: string;

  constructor(
    zone: NgZone,
    public store: Store<AppState>,
    public router: Router,
    public cellarService: CellarService,
    public menuService: MenuService,
    public roleService: RoleService,
    public http: HttpClient,
    public wsService: WebsocketService,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService
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
    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
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

    if (localStorage.getItem('currentstore')) {
      this.currentStore = JSON.parse(localStorage.getItem('currentstore'));
      this.wsService.loginCellar(this.currentStore);
    }
    // setTimeout(() => {
    // }, 500);

    this.cellarService.readData().subscribe(data => { this.cellars = data; });
    combineLatest([
      this.roleService.getMyRole(),
      this.menuService.initMenu()
    ]).subscribe(data => {
      if (data[0].role.type === 'ADMIN') {
        this.http.get<MenuItem[]>('/assets/data/modules.json').subscribe((result: any) => {
          this.myrole = result.filter(r => r.parent !== 'ADMIN');
          this.showNotifications(this.myrole);
          this.store.dispatch(actions.setMyRole({ myroles: this.myrole }));
          this.calculateMenu(data[1], this.myrole);
        });
      } else {
        this.myrole = data[0].role.permissions;
        this.showNotifications(this.myrole);
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

  showNotifications(permissions: PermissionItem[]) {
    this.internalOrderService.getNewIncoming().subscribe((internalOrder: InternalOrderItem) => {
      switch (internalOrder.type) {
        case 'PEDIDO':
          if (permissions.find(p => p.name === 'internalOrders')) {
            const NOTIFICATION: NotificationItem = {
              matIcon: 'send',
              title: 'Pedidos',
              description: 'Solicitud de nuevo pedido',
              url: '/internalOrders/incoming'
            }
            this.toasty.toasty('info', 'Traslados', 'Solicitud de nuevo traslado');
            this.notifications.push(NOTIFICATION);
          }
          break;
        case 'TRASLADO':
          if (permissions.find(p => p.name === 'transfers')) {
            const NOTIFICATION: NotificationItem = {
              matIcon: 'moped',
              title: 'Traslados',
              description: 'Solicitud de nuevo traslado',
              url: '/transfers/incoming'
            }
            this.toasty.toasty('info', 'Traslados', 'Solicitud de nuevo traslado');
            this.notifications.push(NOTIFICATION);
          }
          break;
        default:
          break;
      }
    });
  }

  deleteNotifications(event) {
    this.notifications = this.notifications.filter(n => {
      return n.title !== event
    });
    this.currentPanel = undefined;
  }

  showPanel(panelopen?: string) {
    if (panelopen) {
      if (this.currentPanel === panelopen) {
        this.currentPanel = undefined;
      } else {
        this.currentPanel = panelopen;
      }
    } else {
      this.currentPanel = undefined;
    }
  }

  calculateMenu(menu: MenuItem[], permissions: PermissionItem[]) {
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
    this.wsService.logoutCellar(this.currentStore).then(() => {
      localStorage.removeItem('currentstore');
      this.router.navigate(['/admin']);
    });
  }

  accessToCellar(c: CellarItem) {
    this.wsService.logoutCellar(this.currentStore).then(() => {
      localStorage.setItem('currentstore', JSON.stringify(c));
      this.currentStore = c;
      this.wsService.loginCellar(this.currentStore).then(() => {
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
      });
    });
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
    this.wsService.logoutCellar(this.currentStore).then(() => {
      localStorage.removeItem('farmaciasDO-session');
      localStorage.removeItem('currentstore');
      this.store.dispatch(actions.logoutSuccess());
    });
  }

}
