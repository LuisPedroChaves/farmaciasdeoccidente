import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { UserService } from '../../../../../core/services/httpServices/user.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { RoleItem } from '../../../../../core/models/Role';
import { CellarItem } from 'src/app/core/models/Cellar';
import { UserItem } from 'src/app/core/models/User';
import { EmployeeItem } from 'src/app/core/models/Employee';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, AfterContentInit, OnInit {
  // screen ------
  @Input() smallScreen: boolean;
  @Input() currentUser: UserItem;
  @Input() roles: RoleItem[];
  @Input() employees: EmployeeItem[] = [];

  visible = false;
  loading = false;
  cu = 5;

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
    role: new FormControl(null, [Validators.required]),
    cellar: new FormControl(null),
    _employee: new FormControl(null),
  });

  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public userService: UserService,
    public cellarService: CellarService,
    public toasty: ToastyService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });

    this.cu = this.currentUser.imageIndex;
    this.form = new FormGroup({
      name: new FormControl(this.currentUser.name, [Validators.required]),
      username: new FormControl(this.currentUser.username, [Validators.required]),
      email: new FormControl(this.currentUser.email),
      role: new FormControl(this.currentUser._role ? this.currentUser._role._id : null, [Validators.required]),
      cellar: new FormControl(this.currentUser._cellar ? this.currentUser._cellar._id : null),
      _employee: new FormControl(this.currentUser._employee ? (this.currentUser._employee as any)._id : null),
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

  updateUser() {
    if (this.form.invalid) { return; }
    const role = this.roles.findIndex(r => r._id === this.form.controls.role.value);
    if (role > -1) {
      if (this.roles[role].type === 'EMPLOYEE' && this.form.controls._employee.value === null) {
        this.toasty.error('Para el rol de tipo Empleado debe asignar un empleado de la lista');
        return;
      }
    }
    this.loading = true;
    const newUser: UserItem = this.form.value;
    newUser._id = this.currentUser._id;
    newUser.imageIndex = this.cu;
    newUser._role = this.form.controls.role.value;
    newUser._cellar = this.form.controls.cellar.value;
    newUser._employee = this.form.controls._employee.value;

    
    this.userService.updateUser(newUser).subscribe(data => {
      this.toasty.success('Usuario editado exitosamente');
      this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'userlist');
      this.loading = false;
    }, error => {
      console.log("🚀 ~ file: user-details.component.ts ~ line 103 ~ UserDetailsComponent ~ this.userService.updateUser ~ error", error)
      this.loading = false;
      this.toasty.error('Error', 'Hubo un problema al guardar el usuario, intente de nuevo más tarde.');
    });
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Usuario', message: '¿Confirma que desea eliminar el usuario ' + this.currentUser.name + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.userService.deleteUser(this.currentUser).subscribe(data => {
            this.toasty.success('Usuario Eliminado exitosamente');
            this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'userlist');
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toasty.error('Error', 'Hubo un problema al eliminar el usuario, intente de nuevo más tarde.');
          });
        }
      }
    });
  }

}
