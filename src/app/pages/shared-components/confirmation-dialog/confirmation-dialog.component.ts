import { Component, Inject, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastyService } from '../../../core/services/internal/toasty.service';
import { UserService } from '../../../core/services/httpServices/user.service';
import { UserItem } from '../../../core/models/User';
import { Subscription } from 'rxjs';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit, AfterContentInit, OnDestroy {

  textArea = '';
  user = '';
  pass = '';

  // Repartidores
  usersSubscription: Subscription;
  deliveries: UserItem[];
  delivery: null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService,
    public toasty: ToastyService,
    public uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    if (this.data.isDelivery) {
      this.usersSubscription = this.userService.readData().subscribe(data => {
        this.deliveries = data;
        this.deliveries = this.deliveries.filter(user => user._role.type === 'DELIVERY');
        this.delivery = null;
      });
    }
  }

  ngAfterContentInit() {
    if (this.data.isDelivery) {
      this.userService.loadData();
    }
  }

  ngOnDestroy() {
    if (this.data.isDelivery) {
      this.usersSubscription.unsubscribe();
    }
  }

  upload(file: File, internalOrder: any) {
    if (!file) {
      return;
    }

    this.uploadFileService.uploadFile(file, 'internalOrdersDispatch', internalOrder._id)
      .then((resp: any) => {
        this.toasty.success('Archivo guardado exitosamente');
        internalOrder.dispatchFile = resp.newNameFile;
      })
      .catch(err => {
        this.toasty.error('Error al cargar el archivo');
      });
  }

  login() {
    this.userService.loginAdmin({ username: this.user, password: this.pass }).subscribe(data => {
      this.dialogRef.close(true);
    }, error => {
      this.toasty.error('El usuario o contraseña no es válido');
    });
  }

}
