import { Component, OnInit } from '@angular/core';
import { ControlEvent } from 'src/app/core/models/ControlEvent';
import { UserItem } from 'src/app/core/models/User';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: UserItem[] = [
    {
      _id: '',
      name: 'Andrea',
      username: 'Flick',
      imageIndex: 1,
      _role: null,
      email: 'Andrea@gmial.com'
    }
  ]

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
