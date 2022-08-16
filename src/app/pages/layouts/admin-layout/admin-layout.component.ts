import { Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import * as actions from '../../../store/actions';
import { WebsocketService } from '../../../core/services/httpServices/websocket.service';
import { ChildrenItems, MenuItem } from 'src/app/core/models/Menu';
import { PermissionItem } from 'src/app/core/models/Role';
import { MenuService } from 'src/app/core/services/httpServices/menu.service';
import { RoleService } from 'src/app/core/services/httpServices/role.service';
import { HttpClient } from '@angular/common/http';
import { UpdateNotificationsComponent } from 'src/app/pages/shared-components/update-notifications/update-notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prod';
import { UserComponent } from '../../shared-components/user/user.component';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  smallScreen = window.innerWidth < 960 ? true : false;
  url: string;

  @ViewChild('sidemenu', { static: false }) sidemenu;

  sessionSubscription: Subscription;
  private routeNavigation: Subscription;
  currentuser: any;

  collapse = true;
  dir = 'ltr';
  sidePanelOpened;
  currentPanel: string;
  menuItems: MenuItem[] = [];
  myrole: PermissionItem[];
  loading = false;

  constructor(
    zone: NgZone,
    public store: Store<AppState>,
    public router: Router,
    public wsService: WebsocketService,
    public roleService: RoleService,
    public menuService: MenuService,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    // tslint:disable-next-line: deprecation
    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
      this.store.dispatch(actions.setSmallScreen({ small: this.mediaMatcher.matches }));
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
    });
    this.routeNavigation = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.runOnRouteChange();
    });
    this.loading = true;
    combineLatest([
      this.roleService.getMyRole(),
      this.menuService.initMenu()
    ]).subscribe(data => {
      this.myrole = data[0].role.permissions;
      this.store.dispatch(actions.setMyRole({ myroles: this.myrole }));
      this.calculateMenu(data[1], this.myrole);
    });

    if (!localStorage.getItem('updateNotification') || localStorage.getItem('updateNotification') !== environment.version) {
      this.showUpdate();
    }
  }

  ngOnDestroy() {
    this.sessionSubscription?.unsubscribe();
    this.routeNavigation.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.mediaMatcher.matches) {
      this.sidemenu.close();
    }
  }

  showUpdate() {
    const dialogRef = this.dialog.open(UpdateNotificationsComponent, {
      width: this.smallScreen ? '100%' : '600px',
      height: this.smallScreen ? '100%' : '600px',
      data: {},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        localStorage.setItem('updateNotification', environment.version);
      }
    });
  }

  calculateMenu(menu: MenuItem[], permissions: PermissionItem[]) {
    const parents = permissions.filter(p => p.level === 1);
    let bandera = false;
    parents.forEach(p => {
      const childrens = permissions.filter(mp => mp.parent === p.name);
      const parentEquivalent: MenuItem = menu.filter(m => m.state === p.name)[0];
      // if (childrens.length > 0) {
      //   parentEquivalent.children = [];
      //   childrens.forEach(c => {
      //     const childmenu: ChildrenItems = menu.filter(mc => mc.state === c.name)[0];
      //     parentEquivalent.children.push(childmenu);
      //   });
      // }
      if (bandera === false) {
        if (parentEquivalent.state !== '/admin') {
          this.router.navigate(['admin/' + parentEquivalent.state]);
        }
        bandera = true;
        this.loading = false;
      }
      this.menuItems.push(parentEquivalent);
    });
    this.menuItems.push({
      state: 'payroll',
      name: 'Planilla',
      type: 'sub',
      icon: 'badge',
      iconType: 'icon',
      order: 3,
      children: [
        {
          state: 'payroll',
          name:"Planilla General",
          type:'link',
          icon: 'local_atm',
          iconType: 'icon',
          order: 1
        },
        {
          state: 'employees',
          name:"Empleados",
          type:'link',
          icon: 'engineering',
          iconType: 'icon',
          order: 1
        },
        {
          state: 'employee-transactions',
          name:"Transacciones",
          type:'link',
          icon: 'record_voice_over',
          iconType: 'icon',
          order: 1
        }
      ]
    });

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

  getImage() {
    if (localStorage.getItem('farmaciasDO-session') !== null) {
      const user = JSON.parse(localStorage.getItem('farmaciasDO-session')).user;
      switch (user.imageIndex) {
        case 0: return 'assets/images/avatars/01.png';
        case 1: return 'assets/images/avatars/02.png';
        case 2: return 'assets/images/avatars/03.png';
        case 3: return 'assets/images/avatars/04.png';
        case 4: return 'assets/images/avatars/05.png';
        case 5: return 'assets/images/avatars/00M.jpg';
        case 6: return 'assets/images/avatars/00F.jpg';
      }
    } else {
      return 'assets/images/avatars/00M.jpg';
    }
  }

  logout(): void {
    localStorage.removeItem('farmaciasDO-session');
    this.store.dispatch(actions.logoutSuccess());
  }

  showProfile() {
    const dialogRef = this.dialog.open(UserComponent, {
      width: this.smallScreen ? '100%' : '600px',
      height: this.smallScreen ? '100%' : '720px',
      data: {},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      }
    });
  }

}