import { Component, OnInit, Input } from '@angular/core';
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
  @Input() roles: RoleItem[];

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
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    role: new FormControl(null, [Validators.required])
  });

  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////
  constructor(public eventBus: EventBusService, public config: ConfigService, public usersService: UsersService, public toasty: ToastyService, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.cu = this.currentUser.imageIndex;
    this.form = new FormGroup({
      name: new FormControl(this.currentUser.name, [Validators.required]),
      username: new FormControl(this.currentUser.username, [Validators.required]),
      email: new FormControl(this.currentUser.email),
      role: new FormControl(this.currentUser._role ? this.currentUser._role._id : null, [Validators.required])
    });
  }


  // EVENT FUNCTIONS /////////////////////////////////////////////////////////////////////////////
  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }




  updateUser() {
    if (this.form.invalid) { return; }
    const newUser: UserItem = this.form.value;
    newUser._id = this.currentUser._id;
    newUser.imageIndex = this.cu;
    newUser._role = this.form.controls.role.value;
    this.usersService.updateUser(newUser).subscribe(data => {
      this.toasty.success('Usuario modificado exitosamente');
      this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'userlist');
    }, error => {
      this.toasty.error('Error', 'Hubo un problema al guardar el usuario, intente de nuevo más tarde.');
    });
  }


  deleteUser() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Usuario', message: '¿Confirma que desea eliminar el usuario ' + this.currentUser.name + '?' },
      disableClose: true,
      panelClass: ['iea-dialog'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.usersService.deleteUser(this.currentUser).subscribe(data => {
            this.toasty.success('Usuario Eliminado exitosamente');
            this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'userlist');
          }, error => {
            this.toasty.error('Error', 'Hubo un problema al eliminar el usuario, intente de nuevo más tarde.');
          });
        }
      }
    });
  }

}
