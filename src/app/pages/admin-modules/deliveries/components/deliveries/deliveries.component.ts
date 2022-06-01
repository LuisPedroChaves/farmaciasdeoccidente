import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  deliveriesp: string[] = [];

  constructor(
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    // this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
    //   if (session.permissions !== null) {
    //     const b = session.permissions.filter(pr => pr.name === 'deliveries');
    //     this.deliveriesp = b.length > 0 ? b[0].options : [];
    //   }
    // });
  }

}
