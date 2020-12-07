import { Component, OnInit, NgZone, AfterContentInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { NewCustomersComponent } from '../new-customers/new-customers.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
const SMALL_WIDTH_BREAKPOINT = 960;
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],

})
export class CustomersComponent implements OnInit {

  // screen--------------------------------------------------------------------------------------------
  // subscriptions ------------------
  configSubscription: Subscription;
  sessionsubscription: Subscription;
  // permissions
  smallScreen = window.innerWidth < 960 ? true : false;

  // costumers -------------
  selectedCostumer: any;
  costumersSubscription: Subscription;
  customers: any[] = [
    // tslint:disable-next-line: max-line-length
    { nit: '730613-k', name: 'Luis', address: '|Ciudad', phone: '2535345354', area: '3', town: 'almolonga', department: 'quetzaltenago', company: 'jjhkjh', transport: 'ngkugj', limitCredit:'100', limitDaysCredits:'8'},
    { nit: '730613-k', name: 'Luis', address: '|Ciudad'},
    { nit: '730613-k', name: 'Luis', address: '|Ciudad'},
    { nit: '730613-k', name: 'Luis', address: '|Ciudad'},
  ];
  dataSource = new MatTableDataSource();
  columnsToDisplay = ['name', 'nit', 'address', 'phone'];
  columnsToDisplay2 = ['image', 'name', 'nit', 'address'];
  expandedElement: any | null;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  constructor(public eventBus: EventBusService, public config: ConfigService, public dialog: MatDialog
    ) {

  }

  ngOnInit(): void {
      this.dataSource = new MatTableDataSource(this.customers);
  }




  // OPERATIONAL FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  newCostumer() {
    const dialogRef = this.dialog.open(NewCustomersComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { title: 'Nuevo Cliente'},
      disableClose: true,
      panelClass: ['iea-dialog' ],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  editCostumer(costumer: any) {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
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
