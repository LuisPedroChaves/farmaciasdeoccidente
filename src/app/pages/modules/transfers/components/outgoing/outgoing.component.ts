import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  listview = true;
  loading = false;
  expanded = false;

  balanceInfo: any = {
    "month": null,
    "year": 2020,
    "active": [
      {
        "name": "Fijo", "accounts": [
          { "code": "0151580", "name": "Caja y Bancos", "total": 10000 }
        ]
      },
      { "name": "Circulante", "accounts": [] },
      { "name": "Diferido", "accounts": [] }
    ],
    "passive": [
      {
        "name": "Fijo", "accounts": [
          { "code": "0818556", "name": "Salarios", "total": 5000 }
        ]
      },
      { "name": "Circulante", "accounts": [] },
      { "name": "Diferido", "accounts": [] }
    ],
    "capital": [
      {
        "name": "Fijo", "accounts": [
          { "code": "010000", "name": "Capital", "total": 5000 }
        ]
      }
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
