import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NewCustomerRoutesComponent } from '../new-customer-routes/new-customer-routes.component';
import { EditCustomerRoutesComponent } from '../edit-customer-routes/edit-customer-routes.component';
const SMALL_WIDTH_BREAKPOINT = 960;
@Component({
  selector: 'app-customers',
  templateUrl: './customers-routes.component.html',
  styleUrls: ['./customers-routes.component.scss'],

})
export class CustomersRoutesComponent implements OnInit {

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
    { nit: '730613-k', name: 'Luis', address: '|Ciudad', phone: '2535354', area: '3', town: 'almolonga', department: 'quetzaltenago'},
  ];
  dataSource = new MatTableDataSource();
  columnsToDisplay = ['name', 'nit', 'address', 'phone', 'area', 'town', 'department'];
  columnsToDisplay2 = ['image', 'name', 'nit', 'address', 'phone', 'area', 'town', 'department'];
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
    const dialogRef = this.dialog.open(NewCustomerRoutesComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { title: 'Nuevo Cliente'},
      disableClose: true,
      panelClass: ['iea-dialog' ],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  editCostumer(costumer: any) {
    const dialogRef = this.dialog.open(EditCustomerRoutesComponent, {
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
