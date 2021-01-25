import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { UserItem } from '../../../../../core/models/User';
import { UserService } from '../../../../../core/services/httpServices/user.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements OnInit {

  configSubscription: Subscription;
  sessionsubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;

  employeejobs: any[] = [];

  // jobs
  jobs: any[];
  campus: any[];

  selectedUser: UserItem;

  avatars = [
    { index: 0, image: '/assets/images/avatars/01.png' },
    { index: 1, image: '/assets/images/avatars/02.png' },
    { index: 2, image: '/assets/images/avatars/03.png' },
    { index: 3, image: '/assets/images/avatars/04.png' },
    { index: 4, image: '/assets/images/avatars/05.png' },
    { index: 5, image: '/assets/images/avatars/00M.jpg' },
    { index: 6, image: '/assets/images/avatars/00F.jpg' },
  ];

  constructor(
    public store: Store<AppState>,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( (params) => {
      this.userService.getUser(params.id).subscribe(data => {
        this.selectedUser  = data.user;
      });
    });
  }

}
