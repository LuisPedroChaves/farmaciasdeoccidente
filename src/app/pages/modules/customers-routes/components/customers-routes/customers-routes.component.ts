import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NewCustomerRoutesComponent } from '../new-customer-routes/new-customer-routes.component';
import { EditCustomerRoutesComponent } from '../edit-customer-routes/edit-customer-routes.component';
import { CustomerItem } from '../../../../../core/models/Customer';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { filter } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-customers',
  templateUrl: './customers-routes.component.html',
  styleUrls: ['./customers-routes.component.scss'],

})
export class CustomersRoutesComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  customersSubscription: Subscription;

  selectedCostumer: CustomerItem;
  customers: CustomerItem[];

  customersp: string[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['name', 'nit', 'phone', 'address', 'town', 'department'];
  columnsToDisplay2 = ['image', 'name', 'nit', 'phone', 'address', 'town', 'department'];
  expandedElement: CustomerItem | null;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
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
        const b = session.permissions.filter(pr => pr.name === 'customersRoutes');
        this.customersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data;
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
    const dialogRef = this.dialog.open(NewCustomerRoutesComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { customersp: this.customersp },
      disableClose: true,
      panelClass: ['farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.customerService.loadData();
      }
    });
  }


  editCostumer(customer: CustomerItem) {
    const dialogRef = this.dialog.open(EditCustomerRoutesComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: { customer, customersp: this.customersp },
      disableClose: true,
      panelClass: ['farmacia' ],
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
