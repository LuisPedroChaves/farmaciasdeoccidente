import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';

@Component({
  selector: 'app-banks',
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.scss']
})
export class ReceivablesComponent implements OnInit, AfterContentInit, OnDestroy {
  // screen--------------------------------------------------------------------------------------------
  // subscriptions ------------------
  configSubscription: Subscription;
  sessionsubscription: Subscription;
  accountssubscription: Subscription;
  bankssubscription: Subscription;
  @ViewChild('bankbar') bankbar: MatSidenav;
  smallScreen = window.innerWidth < 960 ? true : false;



  // accounts
  receivables: any[];
  banks: any[];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['customer', 'employee', 'name', 'no.invoice','date' ,'balance' ,'state' , 'credit','creditDays'];
  title = 'Bancos';
  selectedAccount: any;
  constructor(
              public eventBus: EventBusService, public config: ConfigService) { }

  ngOnInit(): void { this.dataSource = new MatTableDataSource(this.receivables);

  }


  ngAfterContentInit() {

  }

  ngOnDestroy() {
    this.configSubscription?.unsubscribe();
    this.sessionsubscription?.unsubscribe();
    this.bankssubscription?.unsubscribe();
    this.accountssubscription?.unsubscribe();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
