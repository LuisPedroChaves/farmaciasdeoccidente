import { Component, NgZone, OnInit } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  collapse = true;
  sidePanelOpened;
  menuItems = [
    { state: '/factory', name: 'Inicio', type: 'link', icon: 'dashboard', order: 1 },
    {
      state: '/factory/production', name: 'Transferencias', type: 'sub', order: 2,icon: 'wifi_protected_setup',
      children: [
        // tslint:disable-next-line: max-line-length
        { state: '/factory/production', name: 'Manufactura', type: 'link', icon: 'settings' },
        { state: '/factory/products', name: 'Productos', type: 'link', icon: 'widgets' },
        { state: '/factory/inventory', name: 'Inventario', type: 'link', icon: 'assignment' },
      ]
    },
    { state: '/factory/purchases', name: 'Ordenes', type: 'link', icon: 'receipt_long', order: 3 },
    {
      state: '/factory/sales', name: 'Rutas', type: 'sub', order: 4, icon: 'electric_moped',
      children: [
        { state: '/factory/billing', name: 'Facturación', type: 'link', svg: 'M2,17H22V21H2V17M6.25,7H9V6H6V3H14V6H11V7H17.8C18.8,7 19.8,8 20,9L20.5,16H3.5L4.05,9C4.05,8 5.05,7 6.25,7M13,9V11H18V9H13M6,9V10H8V9H6M9,9V10H11V9H9M6,11V12H8V11H6M9,11V12H11V11H9M6,13V14H8V13H6M9,13V14H11V13H9M7,4V5H13V4H7Z' },
        { state: '/factory/clients', name: 'Clientes', type: 'link', icon: 'person' }
      ]
    },
    { state: '/factory/employees', name: 'Empleados', type: 'link', icon: 'work_outlined' },
    { state: '/factory/reports', name: 'Clientes', type: 'link', order: 4, icon: 'supervised_user_circle' },
    { state: '/factory/providers', name: 'Cuentas por Cobrar', type: 'link', icon: 'request_quote', order: 2 },
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

}
