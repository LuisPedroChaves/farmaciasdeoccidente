import { AfterContentInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { UserService } from 'src/app/core/services/httpServices/user.service';
import { UserItem } from '../../../../core/models/User';

@Component({
  selector: 'app-inputUser',
  template: `
    <mat-form-field fxFill appearance="outline" color="accent">
      <mat-label>Usuario</mat-label>
      <mat-select [formControl]="user">
          <mat-option *ngFor="let u of users" [value]="u._id">
              {{ u.name }}
          </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styleUrls: []
})
export class InputUserComponent implements OnInit, AfterContentInit, OnDestroy {

  @Output() send = new EventEmitter<UserItem>();

  userSubscription: Subscription;
  users: UserItem[];

  user = new FormControl();

  constructor(
    private userService: UserService
  ) {
    this.userSubscription = this.userService
      .readData()
      .subscribe((data: UserItem[]) => {
        this.users = data;
      });
  }

  ngOnInit(): void {
    this.user.valueChanges.subscribe(id => {
      this.send.emit(
        this.users.find(u => u._id === id)
      );
    });
  }

  ngAfterContentInit(): void {
    this.userService.loadData();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

}
