import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { NewOrdersComponent } from '../new-customers/new-customers.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NewOrderComponent } from '../new-order/new-order.component';
const SMALL_WIDTH_BREAKPOINT = 960;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}configSubscription: Subscription;
sessionsubscription: Subscription;
// permissions
smallScreen = window.innerWidth < 960 ? true : false;

// costumers -------------
selectedCostumer: any;
costumersSubscription: Subscription;
customers: any[] = [
  // tslint:disable-next-line: max-line-length
  { nit: '730613-k', name: 'Luis', address: '|Ciudad', phone: '2535354', area: '3', town: 'almolonga', department: 'quetzaltenago', company: 'jjhkjh', transport: 'ngkugj', limitCredit: '100', limitDaysCredits: '5'},
];
dataSource = new MatTableDataSource();
columnsToDisplay = ['name', 'nit', 'address', 'phone', 'area', 'town', 'department', 'company', 'transport', 'limitCredit', 'limitDaysCredit'];
columnsToDisplay2 = ['image', 'name', 'nit', 'address', 'phone', 'area', 'town', 'department', 'company', 'transport', 'limitCredit', 'limitDaysCredit'];
expandedElement: any | null;
// HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
constructor(public eventBus: EventBusService, public config: ConfigService, public dialog: MatDialog
  ) {

}

ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.orders);
}




// OPERATIONAL FUNCTIONS //////////////////////////////////////////////////////////////////////////////
newOrder() {
  const dialogRef = this.dialog.open(NewOrderComponent, {
    width: this.smallScreen ? '100%' : '500px',
    data: { title: 'Nuevo Cliente'},
    disableClose: true,
    panelClass: ['iea-dialog' ],
  });

  dialogRef.afterClosed().subscribe(result => {

  });
}


editOrder(order: any) {
  const dialogRef = this.dialog.open(EditOrderComponent, {
    width: this.smallScreen ? '100%' : '500px',
    data: { title: 'Nuevo Cliente', client: order},
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



