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
  getImage(index: number) {
    switch (index) {
      case 0: return '/assets/images/avatars/01.png';
      case 1: return '/assets/images/avatars/02.png';
      case 2: return '/assets/images/avatars/03.png';
      case 3: return '/assets/images/avatars/04.png';
      case 4: return '/assets/images/avatars/05.png';
      case 5: return '/assets/images/avatars/00M.jpg';
      case 6: return '/assets/images/avatars/00F.jpg';
    }
  }
}
