import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastyService } from '../../../core/services/internal/toasty.service';
import { UserService } from '../../../core/services/httpServices/user.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  textArea = '';
  user = '';
  pass = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.loginAdmin({username: this.user, password: this.pass}).subscribe(data => {
      this.dialogRef.close(true);
    }, error => {
      this.toasty.error('El usuario o contraseña no es válido');
    });
  }

}
