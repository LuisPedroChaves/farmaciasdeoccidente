import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { NewCustomersComponent } from '../new-customers/new-customers.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerItem } from '../../../../../core/models/Customer';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],

})
export class CustomersComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  costumersSubscription: Subscription;

  selectedCostumer: CustomerItem;
  customers: CustomerItem[];

  customersp: string[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['name', 'nit', 'phone', 'address', 'town', 'department', 'company', 'transport', 'limitCredit', 'limitDaysCredit'];
  columnsToDisplay2 = ['image', 'name', 'nit', 'address', 'phone', 'town', 'department', 'company', 'transport', 'limitCredit', 'limitDaysCredit'];
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
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  editCostumer(costumer: any) {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { title: 'Nuevo Cliente', client: costumer},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
