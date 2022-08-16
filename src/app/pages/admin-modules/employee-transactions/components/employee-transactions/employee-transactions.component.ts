import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { NewDiscountComponent } from '../new-discount/new-discount.component';

@Component({
  selector: 'app-employee-transactions',
  templateUrl: './employee-transactions.component.html',
  styleUrls: ['./employee-transactions.component.scss']
})
export class EmployeeTransactionsComponent implements OnInit {

  configsubscription: Subscription;
  smallScreen: boolean;
  constructor(public dialog: MatDialog, public store: Store<AppState>) { }

  ngOnInit(): void {
    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });
  }




  newFault() {
    const dialogRef = this.dialog.open(NewDiscountComponent, {
      width: this.smallScreen ? '100%' : '500px',
      disableClose: true,
      data: { title: 'Nueva Falta' },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });
  }

}
