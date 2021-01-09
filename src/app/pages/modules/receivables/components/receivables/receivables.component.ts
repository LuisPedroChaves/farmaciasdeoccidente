import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
const SMALL_WIDTH_BREAKPOINT = 960;
@Component({
  selector: 'app-receivables',
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.scss'],

})
export class ReceivablesComponent implements OnInit {

  // screen--------------------------------------------------------------------------------------------
  // subscriptions ------------------
  configSubscription: Subscription;
  sessionsubscription: Subscription;
  // permissions
  smallScreen = window.innerWidth < 960 ? true : false;

  // costumers -------------
  selectedReceivables: any;
  costumersSubscription: Subscription;
  receivables: any[] = [
    // tslint:disable-next-line: max-line-length
    { customer: 'Luis', employee: 'Andrea', date: '10/2/2020', invoice: '3', state: 'pendiente', balance: '100', credit: '-1500', creditDays: '70' },
  ];
  dataSource = new MatTableDataSource();
  columnsToDisplay = ['customer', 'employee', 'date', 'invoice', 'state', 'balance', 'credit','creditDays' ];
  columnsToDisplay2 = ['image', 'customer', 'employee', 'date', 'invoice', 'state', 'balance', 'credit',];
  expandedElement: any | null;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  constructor(public eventBus: EventBusService, public config: ConfigService, public dialog: MatDialog
    ) {

  }

  ngOnInit(): void {
      this.dataSource = new MatTableDataSource(this.receivables);
  }




  // OPERATIONAL FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  newCostumer() {
    const dialogRef = this.dialog.open(ReceivablesComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { title: 'Nuevo Cliente'},
      disableClose: true,
      panelClass: ['iea-dialog' ],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  editCostumer(costumer: any) {
    const dialogRef = this.dialog.open(ReceivablesComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { title: 'Nuevo Cliente', client: costumer},
      disableClose: true,
      panelClass: ['iea-dialog' ],
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
