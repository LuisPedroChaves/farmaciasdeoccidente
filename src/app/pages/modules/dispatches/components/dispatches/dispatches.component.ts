import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CellarItem } from 'src/app/core/models/Cellar';
import { OrderService } from '../../../../../core/services/httpServices/order.service';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.scss']
})
export class DispatchesComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;

  dispatches: OrderItem[];
  currentCellar: CellarItem;

  dispatchessp: string[] = [];

    loading = false;
    saving = false;
    searchText = '';

  constructor(
        public store: Store<AppState>,
        public toasty: ToastyService,
        public dialog: MatDialog,
        public router: Router,
        public orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    // this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
    //     if (session.permissions !== null) {
    //       const b = session.permissions.filter(pr => pr.name === 'courses');
    //       this.dispatchessp = b.length > 0 ? b[0].options : [];
    //     }
    // });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadDispatchs();
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  loadDispatchs() {
    this.loading = true;
    this.orderService.getDispatches(this.currentCellar._id).subscribe(data => {
      this.dispatches = data.dispatches;
      this.loading = false;
    });
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'dispatches']);
  }

}
