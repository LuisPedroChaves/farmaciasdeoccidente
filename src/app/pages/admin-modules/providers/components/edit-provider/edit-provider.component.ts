import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ProviderItem } from 'src/app/core/models/Provider';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss'],
})
export class EditProviderComponent implements OnInit {
  editMode = false;
  loading = false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    checkName: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null),
    address: new FormControl(null),
    email: new FormControl(null),
    creditDays: new FormControl(null),
    credit: new FormControl(null),
    iva: new FormControl(false),
    isr: new FormControl(false),
  });

  constructor(
    public dialogRef: MatDialogRef<EditProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public providerService: ProviderService,
    public toasty: ToastyService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.provider.name, [Validators.required]),
      checkName: new FormControl(this.data.provider.checkName, [Validators.required]),
      nit: new FormControl(this.data.provider.nit, [Validators.required]),
      phone: new FormControl(this.data.provider.phone),
      address: new FormControl(this.data.provider.address),
      email: new FormControl(this.data.provider.email),
      creditDays: new FormControl(this.data.provider.creditDays, [
        Validators.required,
      ]),
      credit: new FormControl(this.data.provider.credit, [
        Validators.required,
      ]),
      iva: new FormControl(this.data.provider.iva),
      isr: new FormControl(this.data.provider.isr),
    });
  }

  saveClient(): void {
    if (this.form.invalid) {
      this.toasty.error('Algunos campos son requeridos')
      return;
    }
    this.loading = true;
    const provider: ProviderItem = {
      ...this.form.value,
      _id: this.data.provider._id,
    };
    this.providerService.updateProvider(provider).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Proveedor editado exitosamente');
          this.dialogRef.close('ok');
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al editar proveedor');
        }
      },
      (error) => {
        this.loading = false;
        this.toasty.error('Error al editar proveedor');
      }
    );
  }
  delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Proveedor',
        message:
          '¿Confirma que desea eliminar el Proveedor ' +
          this.data.provider.name +
          '?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.providerService.deleteProvider(this.data.provider).subscribe(
            (data) => {
              this.toasty.success('Cliente eliminado exitosamente');
              this.providerService.loadData();
              this.dialogRef.close();
              this.loading = false;
            },
            (error) => {
              this.loading = false;
              this.toasty.error('Error al eliminar el cliente');
            }
          );
        }
      }
    });
  }
}
