import { Component, Input, OnInit, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ControlEvent } from 'src/app/core/models/ControlEvent';
import { UserItem } from 'src/app/core/models/User';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { UserService } from '../../../../../core/services/httpServices/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() smallScreen: boolean;

  usersSubscription: Subscription;
  users: UserItem[];

  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.readData().subscribe(data => {
      this.users = data;
    });
  }

  ngAfterContentInit() {
    this.userService.loadData();
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }

  getImage(index: number) {
    switch (index) {
      case 0: return 'assets/images/avatars/01.png';
      case 1: return 'assets/images/avatars/02.png';
      case 2: return 'assets/images/avatars/03.png';
      case 3: return 'assets/images/avatars/04.png';
      case 4: return 'assets/images/avatars/05.png';
      case 5: return 'assets/images/avatars/00M.jpg';
      case 6: return 'assets/images/avatars/00F.jpg';
    }
  }
}
