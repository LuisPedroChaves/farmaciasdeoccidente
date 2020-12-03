import { Component, Input, OnInit } from '@angular/core';
import { ControlEvent } from 'src/app/core/models/ControlEvent';
import { RoleItem } from 'src/app/core/models/Role';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  @Input() roles: RoleItem;

  constructor(public eventBus: EventBusService, public config: ConfigService) { }

  ngOnInit(): void {
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }

}
