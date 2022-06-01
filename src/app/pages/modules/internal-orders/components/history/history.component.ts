import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CellarItem } from 'src/app/core/models/Cellar';
import { AppState } from 'src/app/store/app.reducer';
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

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  });
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
    this.range.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      if (range.start && range.end) {
        this.loadData(range.start, range.end);
      }
    });
  }

  ngAfterContentInit() {
    this.loadData(this.range.get('start').value, this.range.get('end').value);
  }

  loadData(start, end) {
    this.orders = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar._id,
      type: 'PEDIDO',
      origin: this.currentOrigin
    };
    this.internalOrderService.loadData(FILTER);
  }

  getExtfile(file: string) {
    const nameFile = file.split('.');
    return nameFile[nameFile.length - 1];
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
