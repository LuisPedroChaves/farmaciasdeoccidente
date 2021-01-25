import { Component, Input, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ControlEvent } from 'src/app/core/models/ControlEvent';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { UserService } from 'src/app/core/services/httpServices/user.service';
import { EventBusService } from 'src/app/core/services/internal/event-bus.service';
import { UserItem } from 'src/app/core/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() smallScreen: boolean;

  usersSubscription: Subscription;
  users: UserItem[];

  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public userService: UserService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService.readData().subscribe(data => {
      this.users = data;
      this.users = this.users.filter(user => user._role.type === 'DELIVERY');
    });
  }

  ngAfterContentInit() {
    this.userService.loadData();
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
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

  selectDelivery(delivery: UserItem) {
    this.router.navigate(['/delivery', delivery._id]);
  }

}
