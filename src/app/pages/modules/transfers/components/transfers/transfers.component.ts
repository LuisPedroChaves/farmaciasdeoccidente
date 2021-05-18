import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  tab = 'incoming';

  sessionsubscription: Subscription;

  transfersp: string[];

  constructor(
    public store: Store<AppState>,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'transfers');
        this.transfersp = b.length > 0 ? b[0].options : [];
      }
    });
    this.tab = this.router.url;
  }

  changeTab(url: string) {
    this.router.navigate(['/transfers', url]);
    this.tab = url;
  }

}
