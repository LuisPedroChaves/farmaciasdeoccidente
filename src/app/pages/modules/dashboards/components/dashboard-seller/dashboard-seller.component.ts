import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { Router } from '@angular/router';
import { CustomerItem } from 'src/app/core/models/Customer';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-seller',
  templateUrl: './dashboard-seller.component.html',
  styleUrls: ['./dashboard-seller.component.scss']
})
export class DashboardSellerComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  sessionsubscription: Subscription;

  recivables: CustomerItem[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['code', 'nit', 'name', 'company', 'phone', 'address', 'town', 'department', 'limitDaysCredit', 'limitCredit', 'state', 'balance'];
  columnsToDisplay2 = ['image', 'code', 'nit', 'name', 'company', 'phone', 'address', 'town', 'department', 'limitDaysCredit', 'limitCredit', 'state', 'balance'];
  expandedElement: CustomerItem | null;

  constructor(
    public store: Store<AppState>,
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public router: Router,
    public customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      this.customerService.getRecivablesBySeller(session.currentUser.id).subscribe(data => {
        this.recivables = data.customers;
        this.recivables = this.recivables.sort(this.sortDesc);
        this.dataSource = new MatTableDataSource(this.recivables);
        this.loading = false;
      });
    });
  }

  selectCustomer(customer: CustomerItem) {
    this.router.navigate(['statements', customer._id, 'seller']);
  }

  sortDesc(a, b) {
    return parseFloat(a.balance) > parseFloat(b.balance) ? -1 : parseFloat(b.balance) > parseFloat(a.balance) ? 1 : 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
