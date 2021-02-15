import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { combineLatest, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';

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
    this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'deliveries');
        this.deliveriesp = b.length > 0 ? b[0].options : [];
      }
  });
  }

}
