import { Component, OnInit, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../../core/services/httpServices/user.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { UserItem } from 'src/app/core/models/User';
import { RoleItem } from 'src/app/core/models/Role';
import { CellarItem } from '../../../../../core/models/Cellar';
import { EmployeeItem } from 'src/app/core/models/Employee';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, AfterContentInit, OnDestroy {
  // screen ------
  @Input() smallScreen: boolean;
  @Input() roles: RoleItem[];
  @Input() employees: EmployeeItem[] = [];
  visible = false;
  cu = 5;
  loading = false;

  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  // avatars
  avatars = [
    { index: 0, image: 'assets/images/avatars/01.png' },
    { index: 1, image: 'assets/images/avatars/02.png' },
    { index: 2, image: 'assets/images/avatars/03.png' },
    { index: 3, image: 'assets/images/avatars/04.png' },
    { index: 4, image: 'assets/images/avatars/05.png' },
    { index: 5, image: 'assets/images/avatars/00M.jpg' },
    { index: 6, image: 'assets/images/avatars/00F.jpg' },
  ];


  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    _role: new FormControl(null, [Validators.required]),
    _cellar: new FormControl(null),
    _employee: new FormControl(null),
  });
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public userService: UserService,
    public cellarService: CellarService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });
  }

  ngAfterContentInit() {
    this.cellarService.getData();
  }

  ngOnDestroy() {
    this.cellarsSubscription?.unsubscribe();
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }

  createUser() {
    if (this.form.invalid) { return; }
    console.log(this.form.value);
    this.loading = true;
    const newUser: UserItem = this.form.value;
    newUser._id = null;
    newUser.imageIndex = this.cu;
    // this.userService.createUser(newUser).subscribe(data => {
    //   this.toasty.success('Usuario creado exitosamente');
    //   this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'userlist');
    //   this.loading = false;
    // }, error => {
    //   this.loading = false;
    //   this.toasty.error('Error', 'Hubo un problema al guardar el usuario, intente de nuevo más tarde.');
    // });
  }
}
