import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { NewCustomersComponent } from '../new-customers/new-customers.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerItem } from '../../../../../core/models/Customer';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],

})
export class CustomersComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  customersSubscription: Subscription;

  selectedCostumer: CustomerItem;
  customers: CustomerItem[];

  customersp: string[];

  dataSource = new MatTableDataSource();
  // columnsToDisplay = ['code', 'name', 'nit', 'phone', 'address', 'town', 'department', 'company', 'transport', 'limitDaysCredit', 'limitCredit', '_seller'];
  columnsToDisplay2 = ['image', 'code', 'name', 'nit', 'phone', 'address', 'town', 'department', 'company', 'transport', 'limitDaysCredit', 'limitCredit', '_seller'];
  expandedElement: CustomerItem | null;

  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public customerService: CustomerService
    ) {

  }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'customers');
        this.customersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data.filter(customer => customer._seller !== null);
      this.dataSource = new MatTableDataSource(this.customers);
    });
  }

  ngAfterContentInit() {
    this.customerService.loadData();
  }

  ngOnDestroy() {
    this.customersSubscription?.unsubscribe();
    this.sessionsubscription?.unsubscribe();
  }

  newCostumer() {
    const dialogRef = this.dialog.open(NewCustomersComponent, {
      width: this.smallScreen ? '100%' : '800px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { customersp: this.customersp },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.customerService.loadData();
      }
    });
  }

  editCostumer(customer: CustomerItem) {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { customer, customersp: this.customersp },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.customerService.loadData();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
