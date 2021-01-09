import { Component, OnInit, Input, OnDestroy, AfterContentInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { PermissionItem, RoleItem } from '../../../../../core/models/Role';
import { RoleService } from '../../../../../core/services/httpServices/role.service';


@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() roles: RoleItem[];

  allPermissions: PermissionItem[];
  permissionSubscription: Subscription;

  constructor(public eventBus: EventBusService, public config: ConfigService, public  rolesService: RoleService) { }

  ngOnInit(): void {
    this.permissionSubscription = this.rolesService.getPermissionsList().subscribe(data => {
      this.allPermissions = data;
    });
  }

  ngAfterContentInit() {
    this.rolesService.loadData();
  }

  ngOnDestroy() {
    this.permissionSubscription?.unsubscribe();
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }

  getPermissionName(id: string) {
    if (this.allPermissions !== undefined) {
      const index = this.allPermissions.findIndex(p => p.name === name);
      if (index > -1) {
        return this.allPermissions[index].name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
