import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellarItem } from 'src/app/core/models/Cellar';
import { NewTransferComponent } from '../new-transfer/new-transfer.component';

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
  currentCellar: CellarItem;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  getAccountTotal(accounts: any[]): number {
    let total = 0;
    accounts.forEach(a => {
      total += a.total;
    });
    return total;
  }

  newOrder() {
    const dialogRef = this.dialog.open(NewTransferComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id };
        // this.orderService.loadData(filter);
      }
    });
  }

}
