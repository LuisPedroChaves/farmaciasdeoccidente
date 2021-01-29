import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerItem } from 'src/app/core/models/Customer';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
@Component({
  selector: 'app-receivables',
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.scss'],

})
export class ReceivablesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  sessionsubscription: Subscription;

  recivables: CustomerItem[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['nit', 'name', 'company', 'phone', 'address', 'town', 'department', '_seller', 'limitDaysCredit', 'limitCredit', 'state', 'balance' ];
  columnsToDisplay2 = ['image', 'nit', 'name', 'company', 'phone', 'address', 'town', 'department', '_seller', 'limitDaysCredit', 'limitCredit', 'state', 'balance'];
  expandedElement: CustomerItem | null;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public router: Router,
    public customerService: CustomerService
    ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.customerService.getRecivables().subscribe(data => {
      this.recivables = data.customers;
      this.recivables = this.recivables.sort(this.sortDesc);
      this.dataSource = new MatTableDataSource(this.recivables);
      this.loading = false;
    });
  }

  selectCustomer(customer: CustomerItem) {
    this.router.navigate(['/admin/statements', customer._id, '/admin/receivables']);
  }

  sortDesc(a, b) {
    return a.balance > b.balance ? -1 : b.balance > a.balance ? 1 : 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
