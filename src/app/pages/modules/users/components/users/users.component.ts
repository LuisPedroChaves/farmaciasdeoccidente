import { Component, OnInit, NgZone, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserItem } from 'src/app/core/models/User';
import { RoleItem } from 'src/app/core/models/Role';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  // subscriptions ------------------
  configSubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;
  tab = 'userlist';

  currentUser: UserItem;
  currentRole: RoleItem;
  companySubscription: Subscription;

  @ViewChild('sidenavusers') sidenavusers: MatSidenav;

  rolesSubscription: Subscription;
  roles: RoleItem[] = [
    {name: 'rol1', permissions: []},
    {name: 'rol2', permissions: []},
    {name: 'rol3', permissions: []},
    {name: 'rol4', permissions: []},
    {name: 'rol6', permissions: []},
  ];
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  // tslint:disable-next-line: max-line-length
  constructor(public eventBus: EventBusService, public config: ConfigService) {

  }

  ngOnInit(): void {
    this.eventBus.readData().subscribe(event => this.handleEvent(event));
  }

  // tslint:disable-next-line: typedef

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    // this.rolesSubscription?.unsubscribe();
    // this.companySubscription?.unsubscribe();
    // this.configSubscription?.unsubscribe();
  }

  // EVENT FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////
  handleEvent(event: ControlEvent) {
    console.log("🚀 ~ file: users.component.ts ~ line 54 ~ UsersComponent ~ handleEvent ~ event", event);
    switch (event.Event) {
      case this.config.EVENT_USERS_CHANGE_COMPONENT:
        this.tab = event.Payload;
        console.log("🚀 ~ file: users.component.ts ~ line 58 ~ UsersComponent ~ handleEvent ~ this.tab", this.tab);
        if (this.smallScreen) {
          this.sidenavusers.opened = false;
        }
        break;
      case this.config.EVENT_USERS_EDIT:
        this.tab = 'user-details';
        this.currentUser = event.Payload;
        if (this.smallScreen) {
          this.sidenavusers.opened = false;
        }
        break;
      case this.config.EVENT_USERS_EDIT_ROLE:
        this.tab = 'edit-role';
        this.currentRole = event.Payload;
        if (this.smallScreen) {
          this.sidenavusers.opened = false;
        }
        break;
    }
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    console.log("🚀 ~ file: users.component.ts ~ line 81 ~ UsersComponent ~ emitEvent ~ e", e)
    this.eventBus.setData(e);
  }
  }
