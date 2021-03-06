import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { AppState } from 'src/app/core/store/app.reducer';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { InternalOrderService } from '../../../../../core/services/httpServices/internal-order.service';

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
  currentOrigin = 'origen';

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['noOrder', 'date', '_destination', '_user', 'timeInit', 'timeDispatch', 'timeDelivery', '_delivery', 'state', 'file'];
  columnsToDisplay2 = ['image', 'noOrder', 'date', '_destination', '_user', 'timeInit', 'timeDispatch', 'timeDelivery', '_delivery', 'state', 'file'];
  expandedElement: InternalOrderItem | null;

  sessionsubscription: Subscription;
  internalOrdersp: string[] = [];

  constructor(
    public store: Store<AppState>,
    public internalOrderService: InternalOrderService
  ) {
    this.internalOrderService.readData().subscribe(data => {
      this.orders = data;
      this.dataSource = new MatTableDataSource<InternalOrderItem>(this.orders);
    });
  }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'internalOrders');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
  });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  ngAfterContentInit() {
    const filter = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'PEDIDO', origin: this.currentOrigin };
    this.internalOrderService.loadData(filter);
  }

  getExtfile(file: string) {
    const nameFile = file.split('.');
    return nameFile[nameFile.length - 1];
  }

  applyFilter(filterValue?: string) {
    this.orders = undefined;
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
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'PEDIDO', origin: this.currentOrigin };
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
      const filters = { month: this.month, year: this.year, _cellar: this.currentCellar._id, type: 'PEDIDO', origin: this.currentOrigin };
      this.internalOrderService.loadData(filters);
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
