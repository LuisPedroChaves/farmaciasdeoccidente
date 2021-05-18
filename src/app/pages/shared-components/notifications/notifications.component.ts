import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationItem } from '../../../core/models/Notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input() notifications: NotificationItem[];
  @Output() notificationTitle: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  go(notification: NotificationItem) {
    this.router.navigate([notification.url]);
    this.notificationTitle.emit(notification.title);
  }

}
