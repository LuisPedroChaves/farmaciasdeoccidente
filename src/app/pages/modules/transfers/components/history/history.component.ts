import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterContentInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  orders: InternalOrderItem[];
  currentCellar: CellarItem;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['noOrder', 'date', '_destination', '_user', 'timeInit', 'timeDispatch', 'timeDelivery', '_delivery', 'state'];
  columnsToDisplay2 = ['image', 'noOrder', 'date', '_destination', '_user', 'timeInit', 'timeDispatch', 'timeDelivery', '_delivery', 'state'];
  expandedElement: InternalOrderItem | null;

  sessionsubscription: Subscription;
  internalOrdersp: string[] = [];

  constructor(
    public internalOrderService: InternalOrderService,
    public store: Store<AppState>,
  ) {
    this.internalOrderService.readData().subscribe(data => {
      this.orders = data;
      this.dataSource = new MatTableDataSource<InternalOrderItem>(this.orders);
    });
   }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'transfers');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  ngAfterContentInit() {
    const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'TRASLADO' };
    this.internalOrderService.loadData(filter);
  }

  applyFilter(filterValue?: string) {
    if (filterValue) {

      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'TRASLADO' };
      this.internalOrderService.loadData(filters);
    } else {
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'TRASLADO' };
      this.internalOrderService.loadData(filters);
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
