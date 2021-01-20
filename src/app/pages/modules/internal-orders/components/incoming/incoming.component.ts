import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  listview = true;
  loading = false;
  expanded = false;

  balanceInfo: any = {
    "month": null,
    "year": 2020,
    "active": [
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
    ],
    "passive": [
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
    ],
    "capital": [
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
      { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" },
    ]
};

  constructor() { }

  ngOnInit(): void {
  }

  getAccountTotal(accounts: any[]): number {
    let total = 0;
    accounts.forEach(a => {
      total += a.total;
    });
    return total;
  }

}
