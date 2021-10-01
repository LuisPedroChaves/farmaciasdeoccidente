import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { CustomerItem } from '../../../../../core/models/Customer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-customer-routes.component.html',
  styleUrls: ['./edit-customer-routes.component.scss']
})
export class EditCustomerRoutesComponent implements OnInit {

  editMode = false;
  loading = false;

  get addressForm(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null),
    address: new FormControl(null),
    town: new FormControl(null),
    department: new FormControl(null),
    addresses: this.FormBuilder.array([])
  });

  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<EditCustomerRoutesComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog,
  public customerService: CustomerService,
  public toasty: ToastyService,
  private FormBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.customer.name, [Validators.required]),
      nit: new FormControl(this.data.customer.nit,  [Validators.required]),
      phone: new FormControl(this.data.customer.phone),
      address: new FormControl(this.data.customer.address),
      town: new FormControl(this.data.customer.town),
      department: new FormControl(this.data.customer.department, [Validators.required]),
      addresses: this.FormBuilder.array([])
    });

    if (this.data.customer.addresses.length > 0) {
      this.data.customer.addresses.forEach(address => {
        const NEW_ADDRESS = this.FormBuilder.group({
          address: new FormControl(address.address ),
          town: new FormControl(address.town ),
          department: new FormControl(address.department),
        });
        this.addressForm.push(NEW_ADDRESS);
      });
    }
  }

  addAddress() {
    const NEW_ADDRESS = this.FormBuilder.group({
      address: new FormControl(null, ),
      town: new FormControl(null, ),
      department: new FormControl('Huehuetenango', ),
    });
    this.addressForm.push(NEW_ADDRESS);
  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    const customer: CustomerItem = {...this.form.value, _id: this.data.customer._id};
    this.customerService.updateCustomer(customer).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Cliente editado exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al editar el cliente');
      }
    }, error => {
      this.loading = false;
      this.toasty.error('Error al editar el cliente');
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Cliente', message: '¿Confirma que desea eliminar el Cliente ' + this.data.customer.name + '?'},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.customerService.deleteCustomer(this.data.customer).subscribe(data => {
            this.toasty.success('Cliente eliminado exitosamente');
            this.customerService.loadData();
            this.dialogRef.close();
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toasty.error('Error al eliminar el cliente');
          });
        }
      }
    });
  }
}
