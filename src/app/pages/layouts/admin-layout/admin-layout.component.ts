import { Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/core/store/app.reducer';
import * as actions from '../../../core/store/actions';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  url: string;

  @ViewChild('sidemenu', { static: false }) sidemenu;

  sessionSubscription: Subscription;
  private routeNavigation: Subscription;
  currentuser: any;

  collapse = true;
  dir = 'ltr';
  sidePanelOpened;
  currentPanel: string;
  currentStore: any;
  menuItems = [
    { state: '/admin', name: 'Sucursales', type: 'link', icon: 'store', order: 1 },
    { state: 'users', name: 'Usuarios', type: 'link', icon: 'people', order: 2 },
    { state: 'orders', name: 'Ordenes', type: 'link', icon: 'receipt_long', order: 3 },
    // { state: 'employees', name: 'Empleados', type: 'link', icon: 'groups', order: 3 },
    { state: 'receivables', name: 'Cuentas por cobrar', type: 'link', icon: 'request_quote', order: 4, },
  ];

  constructor(
    zone: NgZone,
    public store: Store<AppState>,
    public router: Router
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
    });
    this.routeNavigation = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.runOnRouteChange();
    });
  }

  ngOnDestroy() {
    this.sessionSubscription?.unsubscribe();
  }

  runOnRouteChange(): void {
    // if (this.smallScreen) {
    //   this.sidenav.close();
    //   this.collapsedBar = false;
    // }
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

  logout(): void {
    localStorage.removeItem('farmaciasDO-session');
    this.store.dispatch(actions.logoutSuccess());
  }

}