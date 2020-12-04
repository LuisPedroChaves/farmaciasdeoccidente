import { Component, OnInit, Input, OnDestroy, AfterContentInit } from '@angular/core';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  @Input() roles: any[];
  @Input() companies: any[];

  allPermissions: any[];
  permissionSubscription: Subscription;

  constructor(public eventBus: EventBusService, public config: ConfigService,) { }

  ngOnInit(): void {

  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }
}
