import { Component, OnInit, NgZone, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { RoleService } from '../../../../../core/services/httpServices/role.service';
import { UserItem } from 'src/app/core/models/User';
import { RoleItem } from 'src/app/core/models/Role';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { CellarItem } from 'src/app/core/models/Cellar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterContentInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  tab = 'userlist';

  currentUser: UserItem;
  currentRole: RoleItem;

  @ViewChild('sidenavusers') sidenavusers: MatSidenav;

  rolesSubscription: Subscription;
  roles: RoleItem[];
  employees: EmployeeItem[] = [];
  cellars: string[] = [];
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
  // tslint:disable-next-line: max-line-length
  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public roleService: RoleService,
    public employeeService: EmployeeService,
    public cellarsService: CellarService
    ) {

  }

  ngOnInit(): void {
    this.eventBus.readData().subscribe(event => this.handleEvent(event));

    this.rolesSubscription = this.roleService.readData().subscribe(data => {
      this.roles = data;
    });

    this.employeeService.readData().subscribe(data => {
      this.employees = data;
    });

    this.cellarsService.readData().subscribe(data => {
      const cellars: CellarItem[] = data;
      this.cellars = cellars.map(x => x._id);
      this.employeeService.getData(this.cellars);
    });
  }

  ngAfterContentInit() {
    this.roleService.getData();
    this.cellarsService.loadData();

  }

  ngOnDestroy() {
    this.rolesSubscription?.unsubscribe();
  }

  // EVENT FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////
  handleEvent(event: ControlEvent) {
    switch (event.Event) {
      case this.config.EVENT_USERS_CHANGE_COMPONENT:
        this.tab = event.Payload;
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
    this.eventBus.setData(e);
  }
  }
