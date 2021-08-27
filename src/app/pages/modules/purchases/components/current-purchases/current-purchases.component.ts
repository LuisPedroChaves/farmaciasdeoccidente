import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DetailsPurchaseComponent } from '../details-purchase/details-purchase.component';

@Component({
  selector: 'app-current-purchases',
  templateUrl: './current-purchases.component.html',
  styleUrls: ['./current-purchases.component.scss']
})
export class CurrentPurchasesComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  smallScreen = window.innerWidth < 960 ? true : false;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  purchasesp: string[] = ["read", "update", "delete", "create"];
  purchases: any[] = [
    {
      noBill: '2024',
      _provider: 'Pfizer',
      date: '15/08/2021',
      requisition: '526',
      payment: 'CONTADO',
      total: 2534.61,
      state: 'CREADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2054',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '627',
      payment: 'CREDITO',
      total: 5220.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2055',
      _provider: 'CAPLIN',
      date: '22/08/2021',
      requisition: '745',
      payment: 'CREDITO',
      total: 3226.23,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2056',
      _provider: 'CAPLIN',
      date: '23/08/2021',
      requisition: '746',
      payment: 'CREDITO',
      total: 4562.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2057',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '747',
      payment: 'CONTADO',
      total: 2653.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2058',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '748',
      payment: 'CREDITO',
      total: 9452.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2059',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '749',
      payment: 'CONTADO',
      total: 4523.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2060',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '750',
      payment: 'CONTADO',
      total: 1235.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2061',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '751',
      payment: 'CREDITO',
      total: 4568.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
    {
      noBill: '2062',
      _provider: 'CAPLIN',
      date: '20/08/2021',
      requisition: '755',
      payment: 'CREDITO',
      total: 3568.41,
      state: 'FINALIZADA',
      _user: 'Luis Chaves',
    },
  ];

  dataSource = new MatTableDataSource();
  columns = ['image', 'noBill', '_provider', 'date', 'requisition', 'payment', 'total', '_user', 'options'];

  constructor(
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource<any>(this.purchases);
  }

  ngOnInit(): void {
  }

  details(details) {
    const dialogRef = this.dialog.open(DetailsPurchaseComponent, {
      width: this.smallScreen ? '100%' : '1280px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { details },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }


  applyFilter() {

  }
  applyFilter2(event: Event): void {

  }

}
