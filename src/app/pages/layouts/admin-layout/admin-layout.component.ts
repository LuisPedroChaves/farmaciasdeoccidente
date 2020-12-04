import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    // screen variables---------------------------------
  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  url: string;

  // bar controls -----------------------------------
  collapse = true;
  dir = 'ltr';
  sidePanelOpened;
  currentPanel: string;
  currentStore: any;
  @ViewChild('sidemenu', { static: false }) sidemenu;
  menuItems = [
    { state: '/', name: 'Empresas', type: 'link', icon: 'store', order: 1 },
    { state: 'users', name: 'Usuarios', type: 'link', icon: 'people', order: 2 },
    { state: 'employees', name: 'Empleados', type: 'link', icon: 'groups', order: 3 },
  ];
  constructor(zone: NgZone) {
    // tslint:disable-next-line: deprecation
    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
    }));
    if (this.mediaMatcher.matches) {
      this.collapse = false;
    }
  }

  ngOnInit(): void {

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

}