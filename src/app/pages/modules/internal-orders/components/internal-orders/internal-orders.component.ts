import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-internal-orders',
  templateUrl: './internal-orders.component.html',
  styleUrls: ['./internal-orders.component.scss']
})
export class InternalOrdersComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  tab = 'outgoing';

  sessionsubscription: Subscription;

  internalOrdersp: string[];
  currentStore: any = {
    name: ''
  };

  constructor(
    public store: Store<AppState>,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'internalOrders');
        this.internalOrdersp = b.length > 0 ? b[0].options : [];
      }
    });

    if (localStorage.getItem('currentstore')) {
      this.currentStore = JSON.parse(localStorage.getItem('currentstore'));
    }
  }

  changeTab(url: string) {
    this.router.navigate(['/internalOrders', url]);
    this.tab = url;
  }

}
