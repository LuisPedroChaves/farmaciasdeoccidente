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
        { "name": "Fijo", "accounts":[
            { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo" }
        ] },
        { "name": "Circulante", "accounts":[] },
        { "name": "Diferido", "accounts":[] }
    ],
    "passive": [
        { "name": "Fijo", "accounts":[
            { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo"  }
        ] },
        { "name": "Circulante", "accounts":[] },
        { "name": "Diferido", "accounts":[] }
    ],
    "capital": [
        { "name": "Fijo", "accounts":[
            { "noOrder":"0151580","date":"12/2/2020", "details":"Caja y Bancos", "state": "listo"  }
        ] }
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
