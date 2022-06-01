import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserItem } from 'src/app/core/models/User';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/store/app.reducer';
import { UserService } from '../../../core/services/httpServices/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  cu = 5;
  matcher = new MyErrorStateMatcher();
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

  smallScreen = true;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    role: new FormControl(null, [Validators.required])
  });

  formPass = new FormGroup({
    oldpassword: new FormControl('', [Validators.required]),
    newpassword: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required]),
  }, { validators: this.checkPasswords });

  visible = false;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<UserComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public store: Store<AppState>,
    public userService: UserService,
    public toasty: ToastyService
  ) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('farmaciasDO-session')).user;

    this.form = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required]),
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl(this.user.password, [Validators.required]),
      email: new FormControl(this.user.email),
      _role: new FormControl(this.user._role, [Validators.required]),
      _cellar: new FormControl(this.user._cellar),
    });
    this.cu = this.user.imageIndex;
  }

  updateUser() {
    if (this.form.invalid) { return; }
    const newUser: UserItem = { ...this.form.value };
    newUser._id = this.user._id;
    newUser.imageIndex = this.cu;
    this.userService.updateUser(newUser).subscribe(data => {
      this.toasty.success('Usuario modificado exitosamente');
      const session = JSON.parse(localStorage.getItem('iea-session'));
      session.user = data.user;
      localStorage.setItem('iea-session', JSON.stringify(session));
    }, error => {
      this.toasty.error('Error', 'Hubo un problema al guardar el usuario, intente de nuevo más tarde.');
    });
  }

  saveNewPass() {
    if (this.formPass.invalid) { return; }
    const newpass = {
      oldPassword: this.formPass.controls.oldpassword.value,
      newPassword: this.formPass.controls.newpassword.value
    }
    this.userService.saveNewPass(this.user._id, newpass).subscribe(data => {
      this.toasty.success('Contraseña actualilzada exitósamente');
      this.formPass = new FormGroup({
        oldpassword: new FormControl('', [Validators.required]),
        newpassword: new FormControl('', [Validators.required]),
        confirmpassword: new FormControl('', [Validators.required]),
      }, { validators: this.checkPasswords });;
    }, err => {
      this.toasty.error('Error al modificar la contraseña');
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('newpassword').value;
    const confirmPassword = group.get('confirmpassword').value;

    return password === confirmPassword ? null : { notSame: true }
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}
