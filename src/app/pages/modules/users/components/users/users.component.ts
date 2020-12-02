import { Component, OnInit, NgZone, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
const SMALL_WIDTH_BREAKPOINT = 960;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  // screen--------------------------------------------------------------------------------------------
  // subscriptions ------------------
configSubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;
  tab = 'userlist';


  companySubscription: Subscription;
  @ViewChild('sidenavusers') sidenavusers: MatSidenav;

  rolesSubscription: Subscription;
  store: any;
  rolesService: any;
  roles: any;
  companiesService: any;
  companies: any;
  config: any;
  currentUser: string;
  currentRole: string;
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  // tslint:disable-next-line: max-line-length
  constructor() {

  }

  ngOnInit(): void {

  }

  // tslint:disable-next-line: typedef

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this.rolesSubscription?.unsubscribe();
    this.companySubscription?.unsubscribe();
    this.configSubscription?.unsubscribe();
  }




  // EVENT FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////
  // tslint:disable-next-line: typedef
  handleEvent() {
  }

  // tslint:disable-next-line: typedef
    // tslint:disable-next-line: align
  }

