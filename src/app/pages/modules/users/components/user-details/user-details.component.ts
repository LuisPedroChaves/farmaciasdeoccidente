import { Component, OnInit, Input } from '@angular/core';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserItem } from 'src/app/core/models/User';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
    // screen ------
    @Input() smallScreen: boolean;
    @Input() currentUser: UserItem;
    @Input() roles: any[];

    visible = false;
    cu = 5;

    // avatars
    avatars = [
      { index: 0, image: '/assets/images/avatars/01.png' },
      { index: 1, image: '/assets/images/avatars/02.png' },
      { index: 2, image: '/assets/images/avatars/03.png' },
      { index: 3, image: '/assets/images/avatars/04.png' },
      { index: 4, image: '/assets/images/avatars/05.png' },
      { index: 5, image: '/assets/images/avatars/00M.jpg' },
      { index: 6, image: '/assets/images/avatars/00F.jpg' },
    ];

    form = new FormGroup({
      name : new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      role : new FormControl(null, [Validators.required])
    });

  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  constructor() { }


  ngOnInit(): void {
    this.cu = this.currentUser.imageIndex;
    this.form = new FormGroup({
      name : new FormControl(this.currentUser.name, [Validators.required]),
      username: new FormControl(this.currentUser.username, [Validators.required]),
      email: new FormControl(this.currentUser.email),
      role : new FormControl(this.currentUser._role ? this.currentUser._role._id : null, [Validators.required])
    });
  }


  // EVENT FUNCTIONS /////////////////////////////////////////////////////////////////////////////
  }

